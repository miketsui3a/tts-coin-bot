pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TTS is ERC20 {
    constructor() ERC20("Tong Shing Coin", "TTS") {}

    event Mine(uint256 indexed, uint256 indexed);
    event DiscordTransfer(uint256 indexed, uint256 indexed, uint256 indexed);

    mapping(uint256 => address) public discordIdAddressMap;

    modifier isUser(uint256 discordId) {
        require(
            discordIdAddressMap[discordId] != address(0),
            "This is not a user"
        );
        _;
    }

    function mine(uint256 discordId, uint256 amount) public {
        if (discordIdAddressMap[discordId] == address(0)) {
            discordIdAddressMap[discordId] = address(
                bytes20(keccak256(abi.encodePacked(block.timestamp)))
            );
        }
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
}
