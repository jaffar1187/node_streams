const fs = require("fs/promises");
const SRC_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/src.txt";
const DEST_PATH = "/Users/mastermindapple/Desktop/UNCC-code/streams/dest.txt";

const isEven = (chunk) => {
  let final_chunk = [];
  console.log(chunk);
  chunk.forEach((num) => {
    if (Number(num) % 2 === 0) final_chunk.push(num);
    else if (num === " ") {
      final_chunk.push(num);
    }
  });
  return final_chunk;
};

const run = async () => {
  const read_from_file = await fs.open(SRC_PATH, "r");
  const read_from_stream = read_from_file.createReadStream();

  const write_to_file = await fs.open(DEST_PATH, "w");
  const write_to_stream = write_to_file.createWriteStream();

  let last_num;

  //Read Event
  read_from_stream.on("data", (chunk) => {
    read_from_stream.pause();
    chunk = chunk.toString().split(" ");

    //Removing empty strings.
    if (chunk[0] === "") {
      chunk[0] = " ";
    }
    if (chunk[chunk.length - 1] === "") {
      chunk[chunk.length - 1] = " ";
    }

    //If first number is incomplete
    if (chunk[0] !== " " && Number(chunk[0]) + 1 !== Number(chunk[1])) {
      if (last_num) chunk[0] = last_num.toString() + chunk[0];
    }

    //If last number is incomplete
    if (
      chunk[chunk.length - 1] !== " " &&
      Number(chunk[chunk.length - 1]) - 1 !== Number(chunk[chunk.length - 2])
    ) {
      last_num = chunk.pop();
    }

    // console.log(chunk);

    // console.log(chunk);

    let final_chunk = isEven(chunk);
    // if (!write_to_stream.write(final_chunk.join(" "))) read_from_stream.pause();
    write_to_stream.write(final_chunk.join(" "));
  });

  //Write Event
  write_to_stream.on("drain", () => {
    read_from_stream.resume();
  });

  //Finished reading
  read_from_stream.on("end", () => {
    console.log("Done");
  });
};

run();
