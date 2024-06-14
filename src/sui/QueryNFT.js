import getImgUrl from "./Test.js";

async function main() {
  const hehe = await getImgUrl("0xd5e09984424af743f03c22a1c189f41a1a58ab75deca95faa18b4ff06615df50");
  console.log(hehe);
}

main();