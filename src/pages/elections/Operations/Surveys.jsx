import React, { useCallback, useState, useContext } from "react";

import { BootstrapDialog, BootstrapDialogTitle } from "./Events";
import { Header, useFilters } from "./Operations";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import EventIcon from "@mui/icons-material/Event";
import SickIcon from "@mui/icons-material/Sick";
import { PublicLocationMarker } from "../../public/LocationPicker";
import DetailMap from "./DetailMap";
import { StateContext } from "../../../state/State";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Paper";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Map from "../../../components/Map";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import "survey-react/modern.min.css";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiSwitch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import Select from "@mui/material/Select";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory,
} from "react-router-dom";

import { Survey, StylesManager, Model } from "survey-react";
import useSocket from "../../../components/hooks/useSocket";
import axiosInstance from "../../../state/axiosInstance";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import DateTimePicker from "@mui/lab/DateTimePicker";

import EditIcon from "@mui/icons-material/Edit";
import SurveyCreator from "./SurveyCreator";
StylesManager.applyTheme("modern");

export default function Surveys() {
  const { path } = useRouteMatch();
  return (
    <Container sx={{ mt: 3 }}>
      <Item elevation={0}>
        <Box sx={{ minHeight: "66vh" }}>
          <Switch>
            <Route exact path={path}>
              <SurveyList />
            </Route>
            <Route exact path={`${path}/new`}>
              <SurveyBuilder />
            </Route>
            <Route exact path={`${path}/:id`}>
              <SurveyBuilder />
            </Route>
          </Switch>
        </Box>
      </Item>
    </Container>
  );
}

export function SurveyItem() {
  const { id } = useParams();

  const data = json[id];

  const survey = new Model(data);
  survey.focusFirstQuestionAutomatic = false;

  const alertResults = useCallback((sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  survey.onComplete.add(alertResults);

  return <Survey model={survey} />;
}

function SurveyForm() {
  const socket = useSocket();
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance.post("/survey", {});
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Alert severity="info">
          <Typography variant="caption">
            Survey will be sent to anyone, in all regions. To change this
            setting, restrict this survey to specific people or region
          </Typography>
        </Alert>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}

const SurveyList = () => {
  const { url } = useRouteMatch();
  const { push } = useHistory();

  return (
    <Box>
      <Box sx={{ my: 2, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Surveys</Typography>
        </Box>
        <Box>
          <CustomizedDialogs />
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Default surveys
      </Typography>
      <List dense>
        {json.map((item, index) => {
          return (
            <ListItem
              secondaryAction={
                <IconButton disabled>
                  <EditIcon />
                </IconButton>
              }
              onClick={() => push(`/surveys/${index}/preview`)}
              key={index}
            >
              <ListItemText primary={item.surveyTitle} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

function SurveyQuestion({
  question,
  setQuestion,
  removeQuestion,
  moveQuestionUp,
  moveQuestionDown,
  index,
}) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing(!editing);
  }

  return (
    <div style={{ textAlign: "left" }}>
      <QuestionField>
        {editing ? (
          <QuestionForm question={question} setQuestion={setQuestion} />
        ) : (
          <div>
            <Typography sx={{ mb: 2 }} variant="h6">
              <span style={{ fontWeight: "bold" }}>#{index + 1}</span>:{" "}
              {question.text}
            </Typography>
            {question.hasOptions ? (
              question.options.map((option, i) => (
                <label key={i}>
                  <input
                    variant="standard"
                    type={question.inputType}
                    id={option}
                    name={option}
                    value={option}
                    disabled
                  />
                  {option}
                </label>
              ))
            ) : (
              <textarea disabled />
            )}
          </div>
        )}
        <Box sx={{ bgColor: "mauve" }}>
          <Box sx={{ my: 2, p: 2 }}>
            <Button sx={{ textTransform: "none" }} onClick={toggleEditing}>
              {editing ? <>Save Question</> : <>Edit Question</>}
            </Button>
            <Button sx={{ textTransform: "none" }} onClick={removeQuestion}>
              Delete Question
            </Button>
            <br />
            Move Question:{" "}
            <Button onClick={moveQuestionUp}>
              <i className="fas fa-angle-up icon" />
            </Button>
            <Button onClick={moveQuestionDown}>
              <i className="fas fa-angle-down icon" />
            </Button>
          </Box>
        </Box>
      </QuestionField>
    </div>
  );
}

const QuestionField = ({ children }) => <li>{children}</li>;

function QuestionForm({ question, setQuestion }) {
  function handleChangeText(e) {
    setQuestion(question.merge({ text: e.target.value }));
  }

  function handleChangeType(e) {
    setQuestion(question.merge({ type: e.target.value }));
  }

  function setOptions(options) {
    setQuestion(question.merge({ options }));
  }

  const listController = new ListController(question.options, setOptions);

  return (
    <div>
      <TextField
        label="Question text"
        fullWidth
        variant="standard"
        size="small"
        type="text"
        value={question.text}
        onChange={handleChangeText}
      />

      <FormControl size="small" variant="standard" fullWidth>
        <InputLabel id="demo-simple-select-label">Question Type:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={question.type}
          label="Question Type:"
          onChange={handleChangeType}
        >
          {Object.values(Question.TYPES).map((type, i) => (
            <MenuItem key={i} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {question.hasOptions && (
        <fieldset>
          <legend>Options</legend>

          {question.options.map((option, i) => (
            <Option key={i}>
              <TextField
                size="small"
                variant="standard"
                fullWidth
                sx={{ my: 1 }}
                type="text"
                placeholder="Enter option"
                name={option}
                value={option}
                onChange={(e) => listController.set(i, e.target.value)}
              />
              <Buttons>
                <Button onClick={() => listController.moveUp(i)}>
                  <i className="fas fa-angle-up" />
                </Button>
                <Button onClick={() => listController.moveDown(i)}>
                  <i className="fas fa-angle-down" />
                </Button>
                <Button onClick={() => listController.remove(i)}>
                  <i className="fas fa-trash-alt" />
                </Button>
              </Buttons>
            </Option>
          ))}
          <p>
            <Button onClick={() => listController.add("")}>
              <i className="fas fa-plus icon" />
              Add Option
            </Button>
          </p>
        </fieldset>
      )}
    </div>
  );
}

const Option = ({ children }) => (
  <div style={{ display: "flex" }}>{children}</div>
);

const Buttons = ({ children }) => <div>{children}</div>;

function useInputValue(initial) {
  const [value, setValue] = useState(initial);
  const handleChangeValue = (e) => setValue(e.target.value);
  return [value, handleChangeValue];
}

export function SurveyBuilder() {
  const [title, handleChangeTitle] = useInputValue("New Survey");
  const [questions, setQuestions] = useState([
    new Question({
      text: "What's your favorite color?",
      options: ["Blue", "Orange", "White", "Purple"],
    }),
  ]);

  const listController = new ListController(questions, setQuestions);

  const { push } = useHistory();

  return (
    <Box
      className="small-container"
      sx={{ bgcolor: "rgba(25, 118, 210, 0.08)", borderRadius: "4px", p: 1 }}
    >
      <SurveyTitle title={title} handleChangeTitle={handleChangeTitle} />
      <Divider sx={{ my: 2 }} />
      {questions.map((question, i) => (
        <SurveyQuestion
          index={i}
          key={question.id}
          question={question}
          setQuestion={(question) => listController.set(i, question)}
          removeQuestion={() => listController.remove(i)}
          moveQuestionUp={() => listController.moveUp(i)}
          moveQuestionDown={() => listController.moveDown(i)}
        />
      ))}
      <Button
        startIcon={<AddCircleIcon />}
        variant="outlined"
        onClick={() => listController.add(new Question())}
      >
        Add Question
      </Button>
      <Button
        fullWidth
        disableElevation
        sx={{ mt: 2 }}
        variant="contained"
        onClick={() => {
          console.log(questions);
          push(`/survey/0?mode=preview`);
        }}
      >
        Create and preview
      </Button>
    </Box>
  );
}

function SurveyTitle({ title, handleChangeTitle }) {
  const [editing, setEditing] = useState(false);

  function toggleEditing() {
    setEditing(!editing);
  }

  return (
    <Box sx={{ minWidth: "100%" }}>
      <Box>
        {editing ? (
          <TextField
            fullWidth
            variant="standard"
            type="text"
            value={title}
            sx={{ mb: 2 }}
            onChange={handleChangeTitle}
          />
        ) : (
          <Typography sx={{ mb: 2 }} variant="h6">
            {title}
          </Typography>
        )}
      </Box>
      <Button
        size="small"
        sx={{ textTransform: "none" }}
        onClick={toggleEditing}
        startIcon={
          editing ? (
            <>
              <SaveIcon />
            </>
          ) : (
            <>
              <EditIcon />
            </>
          )
        }
      >
        {editing ? <>Save Title</> : <>Edit Title</>}
      </Button>
    </Box>
  );
}

const surveyTypes = [
  "text",
  "radioGroup",
  "dropDown",
  "checkboxes",
  "carryForward",
  "imagePicker",
  "Boolean",
  "multipleText",
  "rating",
  "ranking",
  "comment",
  "image",
  "fileUploading",
];

const templates = {
  text: {
    type: "text",
    name: "name",
    title: "New Question:",
  },
  checkboxes: {
    type: "checkbox",
    name: "car",
    title: "New Question",
    isRequired: true,
    colCount: 4,
    hasNone: true,
    choices: ["Choice 1"],
  },
};

class Question {
  static TYPES = Object.freeze({
    SINGLE: "Options: Pick One",
    MULTIPLE: "Options: Pick Any Number",
    TEXT: "Short Answer",
  });

  static DEFAULTS = Object.freeze({
    text: "New Question",
    type: Question.TYPES.SINGLE,
    options: [],
  });

  constructor(params = {}) {
    const { text, type, options, id } = { ...Question.DEFAULTS, ...params };
    this.text = text;
    this.type = type;
    this.options = options;
    this.id = id || Math.random();
  }

  get hasOptions() {
    return (
      this.type === Question.TYPES.SINGLE ||
      this.type === Question.TYPES.MULTIPLE
    );
  }

  get inputType() {
    if (this.type === Question.TYPES.SINGLE) return "radio";
    if (this.type === Question.TYPES.MULTIPLE) return "checkbox";
    throw new Error("This question does not have an input type.");
  }

  merge(patch) {
    return new Question({ ...this, ...patch });
  }
}

function set(array, index, element) {
  return [...array.slice(0, index), element, ...array.slice(index + 1)];
}

function remove(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

function insert(array, index, element) {
  return [...array.slice(0, index), element, ...array.slice(index)];
}

function move(array, fromIndex, toIndex) {
  return insert(remove(array, fromIndex), toIndex, array[fromIndex]);
}

class ListController {
  constructor(array, callback) {
    this.array = array;
    this.callback = callback;
  }

  set(index, newContent) {
    this.callback(set(this.array, index, newContent));
  }

  add(newContent) {
    this.callback([...this.array, newContent]);
  }

  remove(index) {
    this.callback(remove(this.array, index));
  }

  moveUp(index) {
    let newIndex = index === 0 ? index : index - 1;
    this.callback(move(this.array, index, newIndex));
  }

  moveDown(index) {
    let newIndex = index === this.array.length - 1 ? index : index + 1;
    this.callback(move(this.array, index, newIndex));
  }
}

export function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(null);

  const { publicLocation } = useContext(StateContext);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ my: 2, textAlign: "right" }}>
        <Button
          startIcon={<EventIcon />}
          size="small"
          variant="outlined"
          onClick={handleClickOpen}
        >
          New Survey
        </Button>
      </Box>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="lg"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          New Survey
        </BootstrapDialogTitle>
        <Header where="New Survey" />
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={9} sx={{ maxHeight: "63vh", overflow: "auto" }}>
              {/* <SurveyBuilder /> */}
              <SurveyCreator />
            </Grid>
            <Grid item xs={3}>
              <Map className="smallMap">
                <DetailMap checked />
                {Boolean(publicLocation?.lat && publicLocation?.lng) && (
                  <PublicLocationMarker />
                )}
              </Map>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button disabled autoFocus onClick={handleClose}>
            Create Survey
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

const json = [
  {
    surveyTitle: "Event Feedback Survey",
    // "completedHtml": "<h3>Thank you for your feedback.</h3> <h5>Your thoughts and ideas will help us to create a great product!</h5>",
    // "completedHtmlOnCondition": [
    //     {
    //         "expression": "{nps_score} > 8",
    //         "html": "<h3>Thank you for your feedback.</h3> <h5>We glad that you love our product. Your ideas and suggestions will help us to make our product even better!</h5>"
    //     }, {
    //         "expression": "{nps_score} < 7",
    //         "html": "<h3>Thank you for your feedback.</h3> <h5> We are glad that you share with us your ideas.We highly value all suggestions from our customers. We do our best to improve the product and reach your expectation.</h5><br/>"
    //     }
    // ],
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "rating",
            name: "nps_score",
            title: "Did you enjoy the event?",
            isRequired: true,
            rateMin: 0,
            rateMax: 10,
            minRateDescription: "(Most unlikely)",
            maxRateDescription: "(Most likely)",
          },
          {
            type: "checkbox",
            name: "promoter_features",
            visibleIf: "{nps_score} >= 9",
            title: "What features do you value the most?",
            isRequired: true,
            validators: [
              {
                type: "answercount",
                text: "Please select two features maximum.",
                maxCount: 2,
              },
            ],
            hasOther: true,
            choices: [
              "Issues affecting us were addressed",
              "I felt represented",
              "I was inspired",
            ],
            otherText: "Other Reason:",
            colCount: 2,
          },
          {
            type: "comment",
            name: "passive_experience",
            visibleIf: "{nps_score} > 6  and {nps_score} < 9",
            title: "What is the primary reason for your score?",
          },
          {
            type: "comment",
            name: "disappointed_experience",
            visibleIf: "{nps_score} notempty",
            title:
              "What do you miss and what was disappointing in your experience with us?",
          },
        ],
      },
    ],
    showQuestionNumbers: "off",
  },
];
