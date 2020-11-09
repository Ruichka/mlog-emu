class Emulator {
  constructor(code,speed) {
    // Declaring some variables
    var prog = code;
    var ipt = speed;
    var counter = 0;
    var printbuffer = [];
    var variables = {};
    var constants = {
      "@counter": counter,
      "@ipt": ipt,
      "@this": {"@health":100, "@x":0, "@y":0}, // Later make it into Block class
      "@thisx": 0,
      "@thisy": 0,
    };
  };
  
  // Must be executed every 1/60th of second (if processor is enabled)
  function tick() {
    for (var i=0;i<ipt;i++) {
      var toinc, tohlt = instruction(prog[counter]);
      if (tohlt) {
        resetProc();
        return;
      }
      if (toinc) {
        counter++;
        constants["@counter"] = counter;
      };
    };
  };
  
  // Execute an instruction
  function instruction(instruct) {
    fields = instruct.split(" ");
    
    // set variable value - Set a variable to any value
    if (fields[0] == "set") {
      if (fields[1]) {
        if (fields[2]) {
          variables[fields[1]] = fields[2]
          return true, false;
        } else {
          console.warn("Execution error at line " + counter + ": Argument #2 is missing");
          return true, false;
        }
      } else {
        console.warn("Execution error at line " + counter + ": No arguments present, atleast 2 required");
        return true, false;
      };
    };
    
    // print text - Adding some text to print buffer
    if (fields[0] == "print") {
      if (fields[1]) {
        printbuffer.push(fields[1]);
        return true, false;
      } else {
        console.warn("Execution error at line " + counter + ": No arguments present, atleast 1 required");
        return true, false;
      };
    };
    
    // printflush messageblock - Flushing the print buffer
    if (fields[0] == "printflush") {
      if (fields[1]) {
        // message1 is currently works as console.log, will be changed when multi-component system will be present
        if (fields[1] == "message1") {
          msg = ""
          for (a=0;a<printbuffer.length;a++) {
            msg = msg + printbuffer[a]
          };
          console.log(msg);
        };
        printbuffer = [];
        return true, false;
      } else {
        console.warn("Execution error at line " + counter + ": No arguments present, atleast 1 required");
        return true, false;
      };
    };
    
    // If operator does not exists
    console.warn("Execution error at line " + counter + ": Invaild operator");
    return true, false;
  };
  
  // Reset the processor to starter settings
  function resetProc() {
    // TODO
  };
};
