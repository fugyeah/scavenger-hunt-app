// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract GameDeposit is ERC721URIStorage, AccessControl, ERC721Holder {
    using Address for address payable;

    address public contractOwner; // Owner state variable
    bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
    uint256 public constant DEPOSIT_AMOUNT = 0.01 ether;
    uint256 public currentTokenId = 0;

    mapping(address => uint256) public playerProgress; // Track each player's progress
    mapping(address => bool) public hasDeposited;

    string public baseURI; // Base URI for metadata

    constructor(string memory _baseURI) ERC721("GameToken", "GT") {
        _setupRole(GAME_ADMIN, _msgSender());
        baseURI = _baseURI;
        contractOwner = msg.sender; // Set the contract deployer as the owner
    }

function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
}


    function depositAndStartGame() external payable {
        require(msg.value == DEPOSIT_AMOUNT, "Incorrect deposit amount");
        require(!hasDeposited[msg.sender], "Already deposited");

        hasDeposited[msg.sender] = true;
        playerProgress[msg.sender] = 1; // Start at clue 1

        currentTokenId++;
        _mint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI(currentTokenId));
    }

function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return string(abi.encodePacked(baseURI, "/", uint2str(tokenId)));
}


    function advanceToNextClue() external {
        // Logic to verify if the player has solved the current clue
        // If solved, advance to the next clue
        playerProgress[msg.sender]++;
    }

   function claimPrize(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(hasRole(GAME_ADMIN, _msgSender()), "Not authorized");

        address payable winner = payable(msg.sender);
        address payable ownerAddress = payable(contractOwner); // Use contractOwner here

        uint256 totalBalance = address(this).balance;
        uint256 winnerAmount = (totalBalance * 85) / 100; // 85% to the winner
        uint256 ownerAmount = totalBalance - winnerAmount; // 15% to the owner

        winner.sendValue(winnerAmount);
        ownerAddress.sendValue(ownerAmount); // Use ownerAddress here

        _burn(tokenId); // Burn the NFT to claim the prize
    }

    function withdrawFunds(address payable recipient) external {
        require(hasRole(GAME_ADMIN, _msgSender()), "Not authorized");
        uint256 balance = address(this).balance;
        recipient.sendValue(balance);
    }

    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
