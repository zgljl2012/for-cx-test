import { ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main (password) {
  // 读取 keystore
  const ks = fs.readFileSync("key.json")
  const signer  = await ethers.Wallet.fromEncryptedJson(ks, password)
  // 连接以太坊主网（此处使用 imtoken 的 rpc）
  const providerETH = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.token.im`)
  const abi = JSON.parse(fs.readFileSync('abi.json'))
  const signer1 = signer.connect(providerETH)
  const contractAddress = '0xacbD7C3357687be445985FCaB1FF4551C88AA375'
  const contract0 = new ethers.Contract(contractAddress, abi, providerETH)
  const contract = contract0.connect(signer1)
  console.log('Start: ')
  // 查看 Balance
  console.log('Balance:', ethers.utils.formatEther(await contract.getBalance()))
  // 发送交易
  const withdraw_to = signer.address // 可更改提现地址
  const withdraw_amount = ethers.utils.parseEther('1') // 可更改提现单位，单位为 Ether
  const tx = await contract.withdraw(withdraw_to, withdraw_amount)
  // 等待链上确认交易
  await tx.wait()
  console.log('Finished.')
}

// 填入 keystore 密码
main("123456")
