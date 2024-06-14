const jsonString='{"name":"sudesh","age":30}'
const jsonData=JSON.parse(jsonString)
console.log(jsonData)

const jsonStringOutput=JSON.stringify(jsonData)

console.log(typeof jsonStringOutput,jsonStringOutput)