import { MobileKeyboardInputView } from "@mui/x-date-pickers/internals";

//Questions Map
export const selfassessmentresult = [
  {
    id: 1,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Little interest or pleasure in doing things?",
    provided_answer: "",
  },
  {
    id: 2,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Feeling down, depressed or hopless?",
    provided_answer: "",
  },
  {
    id: 3,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Trouble falling asleep, staying asleep, or sleeping too much?",
    provided_answer: "",
  },
  {
    id: 4,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Feeling tired or having little energy?",
    provided_answer: "",
  },
  {
    id: 5,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Poor appetite or overeating?",
    provided_answer: "",
  },
  {
    id: 6,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Feeling bad about yourself - or that youre a failure or have let yourself or your family down?",
    provided_answer: "",
  },
  {
    id: 7,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Trouble concentrating on things, such as reading the newspaper or watching television?",
    provided_answer: "",
  },
  {
    id: 8,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Moving or speaking so slowly that other people could have noticed. Or, the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    provided_answer: "",
  },
  {
    id: 9,
    question:
      "Over the past 2 weeks, how often have you been bothered by any of the following problems: Thoughts that you would be better off dead or of hurting yourself in some way?",
    provided_answer: "",
  },
];


export async function convertToList(patientMap){
  const map = new Map([]);
  for (const patient of patientMap) {
    for (const key in patient) {
      if (key !== 'Patient' && key !== 'Firstname'  && key !== 'Lastname') {
          const item = selfassessmentresult.find((q) => q.id === parseInt(key.substring(8)));
          map.set(item?.question, patient[key]);
      }
    }
  }
  if(map.size == 0){
    map.set("", "Something went wrong while fetching the data")
  }
  return map;
}