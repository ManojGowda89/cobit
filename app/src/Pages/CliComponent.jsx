import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Tabs, 
  Tab, 
  Divider, 
  Alert,
  Card,
  CardHeader,
  CardContent,
  Button,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  useTheme
} from '@mui/material';
import { 
  Terminal as TerminalIcon,
  Info as InfoIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CliComponent = () => {
  const theme = useTheme();
  const [osTab, setOsTab] = React.useState(0);
  const [toast, setToast] = React.useState({ open: false, message: '' });
  const [copySuccess, setCopySuccess] = React.useState(null);

  const handleOsTabChange = (event, newValue) => {
    setOsTab(newValue);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setToast({
      open: true,
      message: 'Code copied to clipboard'
    });
    
    // Visual feedback for the button
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const CodeBlock = ({ code, language = 'bash' }) => (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Button
        size="small"
        variant="contained"
        color={copySuccess === code ? "success" : "primary"}
        startIcon={copySuccess === code ? <CheckIcon /> : <CopyIcon />}
        onClick={() => copyCode(code)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          textTransform: 'none',
          fontSize: '0.75rem'
        }}
      >
        {copySuccess === code ? 'Copied!' : 'Copy'}
      </Button>
      <SyntaxHighlighter
        language={language}
        style={theme.palette.mode === 'dark' ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: '16px',
          borderRadius: '4px'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            <TerminalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            COBIT CLI
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader 
              title="What is COBIT?" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <CardContent>
              <Typography paragraph>
                COBIT is a code keeper - not a git alternative, but a simple tool designed to store and organize important code snippets.
              </Typography>
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                With COBIT, you can:
              </Typography>
              <ul>
                <li>Save important code snippets you find that might be useful in the future</li>
                <li>Store anything from simple one-liners to complex algorithms</li>
                <li>Access your code from anywhere through the web interface at <Link href="https://cobit.manojgowda.in/" target="_blank" rel="noreferrer">cobit.manojgowda.in</Link></li>
                <li>Share snippets with friends or a community of developers</li>
                <li>Manage your code through both web and command-line interfaces</li>
              </ul>
              
              <Typography paragraph>
                COBIT is perfect for developers who want to build a personal library of useful code without the complexity of a full version control system.
              </Typography>
            </CardContent>
          </Card>
          
          <Alert 
            icon={<InfoIcon />} 
            severity="info" 
            variant="outlined" 
            sx={{ mb: 3 }}
          >
            COBIT is available as a command-line tool for managing your snippets directly from your terminal!
          </Alert>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader 
              title="Prerequisites" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <CardContent>
              <Typography paragraph>
                Before installing COBIT CLI, you need to have Node.js and npm installed on your system:
              </Typography>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs 
                  value={osTab} 
                  onChange={handleOsTabChange} 
                  aria-label="operating system tabs"
                >
                  <Tab label="Windows" />
                  <Tab label="macOS" />
                  <Tab label="Linux" />
                </Tabs>
              </Box>
              
              {osTab === 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Option 1: Using Chocolatey (Recommended)
                  </Typography>
                  <Typography paragraph>1. Install Chocolatey package manager:</Typography>
                  <CodeBlock 
                    language="powershell"
                    code={`Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`}
                  />
                  <Typography paragraph>2. Install Node.js and npm using Chocolatey:</Typography>
                  <CodeBlock 
                    language="powershell"
                    code="choco install nodejs -y"
                  />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Option 2: Direct Download
                  </Typography>
                  <Typography paragraph>
                    Download and install Node.js from the <Link href="https://nodejs.org/en/download/" target="_blank" rel="noreferrer">official website</Link>.
                  </Typography>
                </Box>
              )}
              
              {osTab === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Option 1: Using Homebrew (Recommended)
                  </Typography>
                  <Typography paragraph>1. Install Homebrew if you haven't already:</Typography>
                  <CodeBlock 
                    code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`}
                  />
                  <Typography paragraph>2. Install Node.js and npm using Homebrew:</Typography>
                  <CodeBlock code="brew install node" />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Option 2: Direct Download
                  </Typography>
                  <Typography paragraph>
                    Download and install Node.js from the <Link href="https://nodejs.org/en/download/" target="_blank" rel="noreferrer">official website</Link>.
                  </Typography>
                </Box>
              )}
              
              {osTab === 2 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Option 1: Using Package Manager (Ubuntu/Debian)
                  </Typography>
                  <CodeBlock 
                    code={`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs`}
                  />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                    Option 2: For other Linux distributions
                  </Typography>
                  <Typography paragraph>
                    Please check the <Link href="https://nodejs.org/en/download/package-manager/" target="_blank" rel="noreferrer">Node.js installation guide</Link> for your specific distribution.
                  </Typography>
                </Box>
              )}
              
              <Alert 
                severity="success" 
                sx={{ mt: 3 }}
              >
                <Typography paragraph sx={{ mb: 1 }}>To verify your installation, run the following commands:</Typography>
                <CodeBlock 
                  code={`node --version
npm --version`}
                />
              </Alert>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader 
              title="Installation" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <CardContent>
              <Typography paragraph>
                Once Node.js and npm are installed, install COBIT CLI globally:
              </Typography>
              <CodeBlock code="npm install @manoj2002/cobit -g" />
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader 
              title="Commands Reference" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <CardContent>
              <TableContainer>
                <Table aria-label="commands table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Command</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><code>cobit init</code></TableCell>
                      <TableCell>Initialize a new Cobit repo (creates remote snippet and saves .cobit)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit add &lt;filename...&gt;</code></TableCell>
                      <TableCell>Stage file(s) for commit</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit commit &lt;message&gt;</code></TableCell>
                      <TableCell>Create a commit from staged files</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit push</code></TableCell>
                      <TableCell>Push the latest commit to the remote snippet</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit clone &lt;repoId&gt;</code></TableCell>
                      <TableCell>Clone a Cobit repo by ID</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit status</code></TableCell>
                      <TableCell>Show repo ID, staged files, and commits</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><code>cobit help</code></TableCell>
                      <TableCell>Display help information</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardHeader 
              title="Usage Examples" 
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText
              }}
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Initialize a new repository
                </Typography>
                <CodeBlock code="cobit init" />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Stage files
                </Typography>
                <CodeBlock code="cobit add index.js" />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Create a commit
                </Typography>
                <CodeBlock code='cobit commit "Add initial files"' />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Push a code
                </Typography>
                <CodeBlock code="cobit push" />
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Clone an existing repository
                </Typography>
                <CodeBlock code="cobit clone abc123" />
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>
      
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        message={toast.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
  );
};

export default CliComponent;