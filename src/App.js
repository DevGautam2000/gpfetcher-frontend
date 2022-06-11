import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Search } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme();

function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}

function Fetcher() {
  const [resp, setResp] = React.useState("");
  const [repo, setRepo] = React.useState(0);
  const [isInProgress, setProgress] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    if (!username) return;
    console.log({
      username,
    });

    if (resp && username === Object.keys(resp).toString()) return;

    setProgress(() => true);
    const url = `http://127.0.0.1:5050/gpfetcher/scraper/${username}`;
    fetch(url)
      .then((data) => data.json())
      .then((res) => {
        setResp(() => res);

        let len = Object.keys(res[username]).length - 1;
        len += Object.keys(res[username]["FORKED"]).length;

        setRepo(() => len);
        setProgress(() => false);
      })
      .catch((err) => console.log(err));
  };

  const preRef = React.useRef();

  function copyText() {
    navigator.clipboard.writeText(preRef.current.innerText);
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <Search />
          </Avatar>
          <Typography component="h1" variant="h5">
            GP Fetcher
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Github Username"
              name="username"
              autoComplete="text"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Fetch
            </Button>
          </Box>
        </Box>
        {isInProgress ? (
          <Container
            sx={{
              position: "relative",
              mt: 3,
              width: "80vw",
              height: "60vh",
              overflowY: "scroll",
              boxShadow: " 0 0 10px #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularIndeterminate />
          </Container>
        ) : null}
        {resp && (
          <Container
            sx={{
              position: "relative",
              mt: 3,
              width: "80vw",
              height: "60vh",
              overflowY: "scroll",
              boxShadow: " 0 0 10px #eee",
            }}
          >
            <pre
              ref={preRef}
              style={{ width: "100%", overflowWrap: "break-word" }}
            >
              {JSON.stringify(resp, null, 2)}
            </pre>

            <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
              {repo} repositories found
              <Tooltip title="Copy">
                <IconButton onClick={copyText}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Container>
        )}
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return <Fetcher />;
}

export default App;
