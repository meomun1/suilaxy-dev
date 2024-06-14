import client from './client.js';
import gql from 'graphql-tag';

const GET_NFT_METADATA = gql`
    query GetNftMetadata($id: ID!) {
    nftMetadata(id: $id) {
        id
        name
        description
        image
        attributes {
        trait_type
        value
        }
    }
    }
`;

const fetchNftMetadata = async (nftId) => {
  try {
    const { data } = await client.query({
      query: GET_NFT_METADATA,
      variables: { id: nftId },
    });

    return data.nft;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
  }
};

// Replace with your NFT's ID
const nftId = '0xd5e09984424af743f03c22a1c189f41a1a58ab75deca95faa18b4ff06615df50';
fetchNftMetadata(nftId).then((metadata) => {
  console.log(metadata);
});
