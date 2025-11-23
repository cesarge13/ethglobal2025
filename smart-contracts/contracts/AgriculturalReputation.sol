// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriculturalReputation
 * @notice Smart Contract para gestión de reputación agrícola on-chain en Polygon Mainnet
 * @dev Compatible con x402 micropayments y agentic actions
 */
contract AgriculturalReputation {
    // Chain ID de Polygon Mainnet: 137
    uint256 public constant POLYGON_CHAIN_ID = 137;
    
    // Estructura para almacenar información del agricultor
    struct Farmer {
        address farmerAddress;
        string farmerId;
        uint256 reputationScore; // 0-100
        uint256 totalVerifications;
        uint256 validCertifications;
        bool isRegistered;
        uint256 registrationDate;
    }
    
    // Estructura para documentos
    struct Document {
        string docHash;
        string docType; // "identity", "certification", "warehouse", "crop"
        uint256 timestamp;
        bool isValidated;
        address validatedBy; // Agente IA que validó
    }
    
    // Estructura para verificaciones
    struct Verification {
        uint256 step; // 1: identidad, 2: certificación, 3: almacén, 4: cultivo
        bool status;
        uint256 timestamp;
        address verifiedBy;
        string details;
    }
    
    // Mapeos
    mapping(address => Farmer) public farmers;
    mapping(address => Document[]) public farmerDocuments;
    mapping(address => Verification[]) public farmerVerifications;
    mapping(address => string[]) public certifications; // Lista de certificaciones válidas
    
    // Eventos
    event FarmerRegistered(address indexed farmer, string farmerId, uint256 timestamp);
    event ReputationUpdated(address indexed farmer, uint256 oldScore, uint256 newScore, uint256 timestamp);
    event DocumentRegistered(address indexed farmer, string docHash, string docType, uint256 timestamp);
    event VerificationLogged(
        address indexed farmer,
        uint256 step,
        bool status,
        address verifiedBy,
        uint256 timestamp
    );
    event CertificationAdded(address indexed farmer, string certification, uint256 timestamp);
    event X402PaymentExecuted(address indexed farmer, uint256 amount, string action, uint256 timestamp);
    
    // Owner del contrato (puede ser el agente IA o un multisig)
    address public owner;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Registra un nuevo agricultor en el sistema
     * @param _farmerAddress Dirección del agricultor
     * @param _farmerId ID único del agricultor
     */
    function registerFarmer(address _farmerAddress, string memory _farmerId) external onlyOwner {
        require(!farmers[_farmerAddress].isRegistered, "Farmer already registered");
        require(_farmerAddress != address(0), "Invalid address");
        
        farmers[_farmerAddress] = Farmer({
            farmerAddress: _farmerAddress,
            farmerId: _farmerId,
            reputationScore: 0,
            totalVerifications: 0,
            validCertifications: 0,
            isRegistered: true,
            registrationDate: block.timestamp
        });
        
        emit FarmerRegistered(_farmerAddress, _farmerId, block.timestamp);
    }
    
    /**
     * @notice Actualiza el score de reputación del agricultor
     * @param _farmerAddress Dirección del agricultor
     * @param _newScore Nuevo score (0-100)
     */
    function updateReputation(address _farmerAddress, uint256 _newScore) external onlyOwner {
        require(farmers[_farmerAddress].isRegistered, "Farmer not registered");
        require(_newScore <= 100, "Score must be between 0 and 100");
        
        uint256 oldScore = farmers[_farmerAddress].reputationScore;
        farmers[_farmerAddress].reputationScore = _newScore;
        
        emit ReputationUpdated(_farmerAddress, oldScore, _newScore, block.timestamp);
    }
    
    /**
     * @notice Registra un documento del agricultor
     * @param _farmerAddress Dirección del agricultor
     * @param _docHash Hash del documento (IPFS o hash local)
     * @param _docType Tipo de documento
     */
    function registerDocument(
        address _farmerAddress,
        string memory _docHash,
        string memory _docType
    ) external onlyOwner {
        require(farmers[_farmerAddress].isRegistered, "Farmer not registered");
        
        farmerDocuments[_farmerAddress].push(Document({
            docHash: _docHash,
            docType: _docType,
            timestamp: block.timestamp,
            isValidated: false,
            validatedBy: address(0)
        }));
        
        emit DocumentRegistered(_farmerAddress, _docHash, _docType, block.timestamp);
    }
    
    /**
     * @notice Marca un documento como validado por el agente IA
     * @param _farmerAddress Dirección del agricultor
     * @param _docIndex Índice del documento en el array
     */
    function validateDocument(address _farmerAddress, uint256 _docIndex) external onlyOwner {
        require(_docIndex < farmerDocuments[_farmerAddress].length, "Invalid document index");
        
        Document storage doc = farmerDocuments[_farmerAddress][_docIndex];
        doc.isValidated = true;
        doc.validatedBy = msg.sender;
    }
    
    /**
     * @notice Registra una verificación realizada por el agente IA
     * @param _farmerAddress Dirección del agricultor
     * @param _step Paso de verificación (1-4)
     * @param _status Estado de la verificación
     * @param _details Detalles de la verificación
     */
    function logVerification(
        address _farmerAddress,
        uint256 _step,
        bool _status,
        string memory _details
    ) external onlyOwner {
        require(farmers[_farmerAddress].isRegistered, "Farmer not registered");
        require(_step >= 1 && _step <= 4, "Invalid verification step");
        
        farmerVerifications[_farmerAddress].push(Verification({
            step: _step,
            status: _status,
            timestamp: block.timestamp,
            verifiedBy: msg.sender,
            details: _details
        }));
        
        farmers[_farmerAddress].totalVerifications++;
        
        // Si la verificación es exitosa, aumentar ligeramente la reputación
        if (_status) {
            uint256 currentScore = farmers[_farmerAddress].reputationScore;
            if (currentScore < 100) {
                uint256 newScore = currentScore + 1;
                if (newScore > 100) newScore = 100;
                farmers[_farmerAddress].reputationScore = newScore;
            }
        }
        
        emit VerificationLogged(_farmerAddress, _step, _status, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Agrega una certificación válida al agricultor
     * @param _farmerAddress Dirección del agricultor
     * @param _certification Nombre de la certificación (ej: "SAGARPA", "SENASICA", "BPA", "Organic")
     */
    function addCertification(address _farmerAddress, string memory _certification) external onlyOwner {
        require(farmers[_farmerAddress].isRegistered, "Farmer not registered");
        
        certifications[_farmerAddress].push(_certification);
        farmers[_farmerAddress].validCertifications++;
        
        // Aumentar reputación por certificación válida
        uint256 currentScore = farmers[_farmerAddress].reputationScore;
        uint256 bonus = 5; // +5 puntos por certificación
        uint256 newScore = currentScore + bonus;
        if (newScore > 100) newScore = 100;
        farmers[_farmerAddress].reputationScore = newScore;
        
        emit CertificationAdded(_farmerAddress, _certification, block.timestamp);
    }
    
    /**
     * @notice Registra la ejecución de un micropago x402
     * @param _farmerAddress Dirección del agricultor
     * @param _amount Cantidad del micropago
     * @param _action Acción que disparó el pago
     */
    function logX402Payment(
        address _farmerAddress,
        uint256 _amount,
        string memory _action
    ) external onlyOwner {
        emit X402PaymentExecuted(_farmerAddress, _amount, _action, block.timestamp);
    }
    
    /**
     * @notice Obtiene información completa del agricultor
     * @param _farmerAddress Dirección del agricultor
     * @return farmerInfo Información del agricultor
     * @return docCount Número de documentos
     * @return verificationCount Número de verificaciones
     */
    function getFarmerInfo(address _farmerAddress) 
        external 
        view 
        returns (
            Farmer memory farmerInfo,
            uint256 docCount,
            uint256 verificationCount
        ) 
    {
        farmerInfo = farmers[_farmerAddress];
        docCount = farmerDocuments[_farmerAddress].length;
        verificationCount = farmerVerifications[_farmerAddress].length;
    }
    
    /**
     * @notice Obtiene todos los documentos de un agricultor
     * @param _farmerAddress Dirección del agricultor
     * @return docs Array de documentos
     */
    function getFarmerDocuments(address _farmerAddress) 
        external 
        view 
        returns (Document[] memory docs) 
    {
        return farmerDocuments[_farmerAddress];
    }
    
    /**
     * @notice Obtiene todas las verificaciones de un agricultor
     * @param _farmerAddress Dirección del agricultor
     * @return verifications Array de verificaciones
     */
    function getFarmerVerifications(address _farmerAddress) 
        external 
        view 
        returns (Verification[] memory verifications) 
    {
        return farmerVerifications[_farmerAddress];
    }
    
    /**
     * @notice Obtiene las certificaciones de un agricultor
     * @param _farmerAddress Dirección del agricultor
     * @return certs Array de certificaciones
     */
    function getFarmerCertifications(address _farmerAddress) 
        external 
        view 
        returns (string[] memory certs) 
    {
        return certifications[_farmerAddress];
    }
}

