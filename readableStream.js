const fs = require("fs/promises");
const SRC_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/src.txt";
const DEST_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/dest.txt";

const run1 = async () => {
  const fileHandleRead = await fs.open(SRC_PATH, "r");
  const read_stream = fileHandleRead.createReadStream();

  const fileHandlewrite = await fs.open(DEST_PATH, "w");
  const write_stream = fileHandlewrite.createWriteStream();

  read_stream.on("data", (chunk) => {
    read_stream.pause();
    let loop_count = chunk.length - 16384;
    let i = 0;

    writeToStreamAfterDrain = () => {
      while (i <= loop_count) {
        if (i == 0) {
          if (!write_stream.write(chunk.slice(i, i + 16384))) {
            i += 16384;
            break;
          }
        } else {
          if (!write_stream.write(chunk.slice(i, i + 16385))) {
            i += 16384;
            break;
          }
        }
      }
      if (i > loop_count) read_stream.resume();
    };

    writeToStreamAfterDrain();

    write_stream.on("drain", () => {
      writeToStreamAfterDrain();
    });
  });
};

run1().catch((e) => {
  console.log("Some error occurred", e);
});
