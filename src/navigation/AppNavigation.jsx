import { BrowserRouter as Router } from "react-router-dom";

import AtlasAmin from "../pages/elections/AtlasAdmin";
import Agents from "../pages/agents/Agents";
import Editor from "../components/editor/Editor";

import Prev from "../pages/Atlas/Prev/Prev";
import Upload from "../pages/Admin/Upload"
import LandingPage from "../pages/LandingPage";
import Accounts from "../components/accounts/Accounts";

import Navigation from "./Navigation";
import Votes from "../components/Votes/Votes";

import PreviewSurvey from "./Guest/PreviewSurvey"

const routes = [
  { path: "/", Component: LandingPage, isExact: true },
  { path: "/accounts", Component: Accounts },
  { path: "/operations", Component: AtlasAmin },
  { path: "/portal", Component: Agents },
  { path: "/atlas", Component: Prev },
  { path: "/editor", Component: Editor, },
  { path: "/upload", Component: Upload },
  { path: "/votes", Component: Votes },
  {path:"/survey/:id", Component: PreviewSurvey}
];

export default function AppNavigation() {
  return (
    <Router>
      <Navigation options={routes} />
    </Router>
  );
}
