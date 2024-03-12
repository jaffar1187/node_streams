const fs = require("fs/promises");
const FILE_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/src.txt";

//----------------------------Promises(Traditional Slow approach)-----------------
// Time: 10s
// Cpu usage: 100% (One core)
// Memory: 35 Mb
const run1 = async () => {
  const fileHandler = await fs.open(FILE_PATH, "w"); // Clear file contents
  console.time("writeMany");
  for (let i = 0; i < 1e6; i++) {
    await fileHandler.write(`${i + 1} `);
  }
  console.timeEnd("writeMany");
  await fileHandler.close();
};

// run1().catch((e) => {
//   console.log("Some error occured");
// });

//--------------------------Streams---------------------------

// Dont use as it has some memory issues.
// Time: 180 ms
// Cpu usage: NA
// Memory: 200MB

// console.log(buff[0]); // It will be in decimal like 49D = 1 Ascii
// console.log(buff.toString()); convert back to ascii but only full buffer.

const run2 = async () => {
  const fileHandler = await fs.open(FILE_PATH, "w"); // Clear file contents and create file if it does not exists.
  const stream = fileHandler.createWriteStream();
  console.time("writeMany");
  for (let i = 0; i < 1e6; i++) {
    const buff = Buffer.from(`${i + 1} `, "utf-8"); //By default utf-8 only. and it converts to hex format while console.log
    stream.write(buff);
  }
  console.timeEnd("writeMany");
  await fileHandler.close();
};

// run2().catch((e) => {
//   console.log("Some error occured");
// });

//------------------------Stream(Memory efficient)

// Time: 270 ms
// Cpu usage: NA
// Memory: 50MB

const run3 = async () => {
  const fileHandler = await fs.open(FILE_PATH, "w"); // Clear file contents and create file if it does not exists.
  const stream = fileHandler.createWriteStream();
  console.time("writeMany");
  let i = 0;
  let loopCount = 1e9; // -- For readable stream this number. or for monitoring activity
  // let loopCount = 1e6;

  const writeToStreamAfterDrain = () => {
    while (i < loopCount) {
      const buff = Buffer.from(`${i + 1} `, "utf-8"); //By default utf-8 only. and it converts to hex format while console.log

      if (i === loopCount - 1) {
        console.timeEnd("writeMany");
        //Writing the last chunk of data, after writing emit finish event.
        stream.end(buff);
      } else if (!stream.write(buff)) break;
      i++;
    }
  };

  writeToStreamAfterDrain();
  let drainCount = 0;
  stream.on("drain", () => {
    ++drainCount;
    writeToStreamAfterDrain();
  });

  stream.on("finish", async () => {
    console.log("Drained: ", drainCount); // 420
    await fileHandler.close();
  });
};

run3().catch((e) => {
  console.log("Some error occured", e);
});
