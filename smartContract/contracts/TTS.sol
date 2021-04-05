pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TTS is Initializable, ERC20Upgradeable{
    event Mine(uint256 indexed, uint256 indexed);
    event DiscordTransfer(uint256 indexed, uint256 indexed, uint256 indexed);
    event ChangeWalletAddress(uint256 indexed, address indexed);
    event Register(uint256 indexed);

    mapping(uint256 => address) public discordIdAddressMap;
    mapping(uint256 => string) public discordIdPrivateKeyMap;

    modifier isUser(uint256 discordId) {
        require(
            discordIdAddressMap[discordId] != address(0),
            "This is not a user"
        );
        _;
    }

    function initialize(
        string memory name_,
        string memory symbol_
    ) public virtual initializer {
        __ERC20_init(name_, symbol_);
    }

    function register(
        uint256 discordId,
        string memory privateKey,
        address addr
    ) public {
        require(
            discordIdAddressMap[discordId] == address(0),
            "already registered"
        );
        discordIdAddressMap[discordId] = addr;
        discordIdPrivateKeyMap[discordId] = privateKey;
        emit Register(discordId);
    }

    function mine(uint256 discordId, uint256 amount) public isUser(discordId) {
        _mint(discordIdAddressMap[discordId], amount);
        emit Mine(discordId, amount);
    }

    function discordTransfer(
        uint256 from,
        uint256 to,
        uint256 amount
    ) public isUser(from) isUser(to) {
        _transfer(discordIdAddressMap[from], discordIdAddressMap[to], amount);
        emit DiscordTransfer(from, to, amount);
    }

    function getBalance(uint256 discordId)
        public
        view
        isUser(discordId)
        returns (uint256)
    {
        return balanceOf(discordIdAddressMap[discordId]);
    }

    function getWalletAddres(uint256 discordId)
        public
        view
        isUser(discordId)
        returns (address)
    {
        return discordIdAddressMap[discordId];
    }

    function getPrivateKey(uint256 discordId)
        public
        view
        isUser(discordId)
        returns (string memory)
    {
        return discordIdPrivateKeyMap[discordId];
    }

    function setWalletAddress(uint256 discordId, address walletAddress) public {
        discordIdAddressMap[discordId] = walletAddress;
        discordIdPrivateKeyMap[discordId] = "User defined wallet";
        emit ChangeWalletAddress(discordId, walletAddress);
    }

    function test()pure public{
        
    }
}
