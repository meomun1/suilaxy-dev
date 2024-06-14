import axios from 'axios';

async function getImgUrl(objectId) {

    const data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sui_getObject",
        "params": [
            objectId,
          {
            "showType": true,
            "showOwner": true,
            "showPreviousTransaction": true,
            "showDisplay": false,
            "showContent": true,
            "showBcs": false,
            "showStorageRebate": true
          }
        ]
      };

    try {
      const response = await axios.post('https://fullnode.testnet.sui.io', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return JSON.stringify(response.data.result.data.content.fields.url, null, 2);
    } catch (error) {
      console.log(error);
    }
}

export default getImgUrl;