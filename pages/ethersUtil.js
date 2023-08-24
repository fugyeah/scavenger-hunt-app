import { ethers } from 'ethers';
import GameDepositABI from './path_to_GameDeposit_ABI.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";
const gameContract = new ethers.Contract(contractAddress, GameDepositABI, signer);

export async function getPlayerProgress(address) {
    return await gameContract.playerProgress(address);
}

export async function submitCode(code, tokenId) {
    const uniqueNFTData = ethers.utils.hexlify(tokenId);
    const combinedHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(code + uniqueNFTData));
    return await gameContract.advanceToNextClue(code, combinedHash);
}

export async function connectWallet() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  return provider.getSigner();
}

export async function depositAndStartGame() {
  const tx = await gameContract.depositAndStartGame({ value: ethers.utils.parseEther('0.01') });
  await tx.wait();
}

export async function claimPrize(tokenId) {
  const tx = await gameContract.claimPrize(tokenId);
  await tx.wait();
}

export function onGameStarted(callback) {
    gameContract.on("GameStarted", (player, event) => {
        console.log("Game started for player:", player);
        callback(event);
    });
}

export function onClueAdvanced(callback) {
    gameContract.on("ClueAdvanced", (player, newLevel) => {
        console.log("Player advanced to level:", newLevel);
        callback({ player, newLevel });
    });
}

export function onGameOver(callback) {
    gameContract.on("GameOver", (winner, event) => {
        console.log("Game over! Winner:", winner);
        callback(event);
    });
}
