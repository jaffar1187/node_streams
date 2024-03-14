const fs = require("fs/promises");
const SRC_PATH =
  "/Users/mastermindapple/Desktop/UNCC-code/streams/src-gigantic.txt";
const DEST_PATH =
  "/Users/mastermindapple/Desktop/UNCC-code/streams/piping-dest.txt";

const run = async () => {
  console.time("copy");

  const read_from_file = await fs.open(SRC_PATH, "r");
  const read_from_stream = read_from_file.createReadStream();

  const write_to_file = await fs.open(DEST_PATH, "w");
  const write_to_stream = write_to_file.createWriteStream();

  read_from_stream.pipe(write_to_stream);

  read_from_stream.on("end", () => {
    console.timeEnd("copy");
    read_from_file.close();
    write_to_file.close();
  });
};

run();
