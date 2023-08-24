export default function Profile() {
    // Fetch the player's progress and NFT details from the Ethereum contract
    const progress = "Clue 3"; // Example value
    const nftImage = "path_to_nft_image.jpg"; // Example value
  
    return (
      <div>
        <h1>Your Profile</h1>
        <p>Progress: {progress}</p>
        <img src={nftImage} alt="Your NFT" />
      </div>
    );
  }
  