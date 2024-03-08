const fs = require("fs/promises");
const FILE_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/test.txt";

//----------------------------Promises---------------------------
// Time: 40s
// Cpu usage: 100% (One core)
// Memory: 35 Mb
const run1 = async () => {
  await fs.writeFile(FILE_PATH, ``); // Clear file contents
  console.time("writeMany");
  for (let i = 0; i < 1000000; i++) {
    await fs.appendFile(FILE_PATH, `${i + 1} `);
  }
  console.timeEnd("writeMany");
};

// run1().catch((e) => {
//   console.log("Some error occured");
// });

//--------------------------Streams---------------------------

// Dont use as it has some memory issues.
// Time: < 180 ms
// Cpu usage: NA
// Memory: 200MB

// console.log(buff[0]); // It will be in decimal like 49D = 1 Ascii
// console.log(buff.toString()); convert back to ascii but only full buffer.

const run2 = async () => {
  const fileHandler = await fs.open(FILE_PATH, "w"); // Clear file contents and create file if it does not exists.
  const stream = fileHandler.createWriteStream();
  console.time("writeMany");
  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(`${i + 1} `, "utf-8"); //By default utf-8 only. and it converts to hex format while console.log
    stream.write(buff);
  }
  console.timeEnd("writeMany");
};

// run2().catch((e) => {
//   console.log("Some error occured");
// });

//------------------------Stream(Memory efficient)

// Time: < 180 ms
// Cpu usage: NA
// Memory: 200MB

const run3 = async () => {
  const fileHandler = await fs.open(FILE_PATH, "w"); // Clear file contents and create file if it does not exists.
  const stream = fileHandler.createWriteStream();
  console.time("writeMany");
  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(`${i + 1} `, "utf-8"); //By default utf-8 only. and it converts to hex format while console.log
    stream.write(buff);
  }
  console.timeEnd("writeMany");
};

run3().catch((e) => {
  console.log("Some error occured");
});
