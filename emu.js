class Emulator {
  constructor(code,speed) {
    // Declaring some variables
    this.prog = code;
    this.ipt = speed;
    this.counter = 0;
    this.printbuffer = [];
    this.variables = {};
    this.constants = {
      "@counter": this.counter,
      "@ipt": this.ipt,
      "@this": {"@health":100, "@x":0, "@y":0}, // Later make it into Block class
      "@thisx": 0,
      "@thisy": 0,
    };
  };
  
  // Must be executed every 1/60th of second (if processor is enabled)
  tick() {
    for (var i=0;i<this.ipt;i++) {
      var toact = this.instruction(this.prog[this.counter]);
      if (toact[1]) {
        this.resetProc();
        return;
      }
      if (toact[0]) {
        this.counter++;
        this.constants["@counter"] = this.counter;
      };
    };
  };
  
  // Execute an instruction
  instruction(instruct) {
    var fields = instruct.split(" ");
    
    // set variable value - Set a variable to any value
    if (fields[0] == "set") {
      if (fields[1]) {
        if (fields[2]) {
          this.variables[fields[1]] = fields[2]
          return [true, false];
        } else {
          console.warn("Execution error at line " + this.counter + ": Argument #2 is missing");
          return [true, false];
        }
      } else {
        console.warn("Execution error at line " + this.counter + ": No arguments present, atleast 2 required");
        return [true, false];
      };
    };
    
    // print text - Adding some text to print buffer
    if (fields[0] == "print") {
      if (fields[1]) {
        this.printbuffer.push(fields[1]);
        return [true, false];
      } else {
        console.warn("Execution error at line " + this.counter + ": No arguments present, atleast 1 required");
        return [true, false];
      };
    };
    
    // printflush messageblock - Flushing the print buffer
    if (fields[0] == "printflush") {
      if (fields[1]) {
        // message1 currently works as console.log, will be changed when multi-component system will be present
        if (fields[1] == "message1") {
          var msg = ""
          for (var a=0;a<this.printbuffer.length;a++) {
            msg = msg + this.printbuffer[a]
          };
          console.log(msg);
        };
        this.printbuffer = [];
        return [true, false];
      } else {
        console.warn("Execution error at line " + this.counter + ": No arguments present, atleast 1 required");
        return [true, false];
      };
    };
    
    // If operator does not exists
    console.warn("Execution error at line " + this.counter + ": Invaild operator");
    return [true, false];
  };
  
  // Reset the processor to starter settings
  resetProc() {
    // TODO
  };
};
