//Allows access to LRS
const conf = {
    "endpoint": "https://example.lrs",
    "auth": "Basic " + toBase64("username:password")
  };
ADL.XAPIWrapper.changeConfig(conf);

//Gathers and sends user information to LRS
function sendStatement(verb, verbId, object, objectId, openTextVar) {
  const player = GetPlayer();
  const uNamejs = player.GetVar("userName");
  const userResponse = player.GetVar(openTextVar);
  const statement = {

    /*
    Based on user's choice, one of three functions will be called in StoryLine:
      userRace = human then: sendStatement("selected", "http://id.tincanapi.com/verb/selected", "human", "https://www.dndbeyond.com/races/human", "userClass")
      userRace = dwarf then: sendStatement("selected", "http://id.tincanapi.com/verb/selected", "dwarf", "https://www.dndbeyond.com/races/dwarf", "userClass")
      userRace = half-orc then: sendStatement("selected", "http://id.tincanapi.com/verb/selected", "half-orc", "https://www.dndbeyond.com/races/half-orc", "userClass")
    */

    "actor": {
      "name": uNamejs,
      "mbox": "mailto:" + uNamejs +"@email.com"
    },
    "verb": {
      "id": verbId,
      "display": { "en-us": verb }
    },
    "object": {
      "id": objectId,
      "definition": {
        "name": { "en-us": object }
      }
    },
    "result": {
      "response": userResponse
    }
  };
  const result = ADL.XAPIWrapper.sendStatement(statement);
};

//Detects white space(s) in entered name, throws error in StoryLine if true
function whiteSpace() {
  const player = GetPlayer();
  const goodNamejs = player.GetVar("userName");

  const wSpacejs = goodNamejs.indexOf(' ') >=0;

  player.SetVar("wSpace", wSpacejs);
};


//Queries LRS based on userName input. Pulls stored information and populates within StoryLine.
function populateCharacterSheet() {
  const player = GetPlayer();
  const uNamejs = player.GetVar("userName");

  const parameters = ADL.XAPIWrapper.searchParams();

  parameters["agent"] = '{"mbox":"mailto:' + uNamejs + '@email.com"}'
  parameters["verb"] = "http://id.tincanapi.com/verb/selected";

  const queryData = ADL.XAPIWrapper.getStatements(parameters);
  const statements = queryData.statements;

  player.SetVar("userRace", statements[0].object.definition.name["en-us"]);
  player.SetVar("userClass", statements[0].result.response);

};
