import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardHeader,
  CardContent, 
  Alert, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Button, 
  Link
} from '@mui/material';
import { Terminal as TerminalIcon, LinkedIn as LinkedInIcon } from '@mui/icons-material';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const CLIInfo = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // Add visual feedback here
  };

  // Apply syntax highlighting to code blocks when component mounts or tabs change
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [tabValue]);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          COBIT CLI
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="What is COBIT?" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Typography paragraph>
              COBIT is a code keeper - not a git alternative, but a simple tool designed to store and organize important code snippets.
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="bold">
              With COBIT, you can:
            </Typography>
            <ul>
              <li>Save important code snippets you find that might be useful in the future</li>
              <li>Store anything from simple one-liners to complex algorithms</li>
              <li>Access your code from anywhere through the web interface at <Link href="https://cobit.manojgowda.in/" target="_blank">cobit.manojgowda.in</Link></li>
              <li>Share snippets with friends or a community of developers</li>
              <li>Manage your code through both web and command-line interfaces</li>
            </ul>
            
            <Typography paragraph>
              COBIT is perfect for developers who want to build a personal library of useful code without the complexity of a full version control system.
            </Typography>
          </CardContent>
        </Card>
        
        <Alert 
          icon={<TerminalIcon />} 
          severity="info"
          sx={{ mb: 3 }}
        >
          COBIT is available as a command-line tool for managing your snippets directly from your terminal!
        </Alert>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Prerequisites" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Typography paragraph>
              Before installing COBIT CLI, you need to have Node.js and npm installed on your system:
            </Typography>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ mb: 2 }}
            >
              <Tab label="Windows" />
              <Tab label="macOS" />
              <Tab label="Linux" />
            </Tabs>
            
            {tabValue === 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Option 1: Using Chocolatey (Recommended)
                </Typography>
                <Typography paragraph>1. Install Chocolatey package manager:</Typography>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <pre>
                    <code className="language-powershell">
                      Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
                    </code>
                  </pre>
                </Box>
                
                <Typography paragraph>2. Install Node.js and npm using Chocolatey:</Typography>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <pre>
                    <code className="language-powershell">
                      choco install nodejs -y
                    </code>
                  </pre>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                  Option 2: Direct Download
                </Typography>
                <Typography paragraph>
                  Download and install Node.js from the <Link href="https://nodejs.org/en/download/" target="_blank">official website</Link>.
                </Typography>
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Option 1: Using Homebrew (Recommended)
                </Typography>
                <Typography paragraph>1. Install Homebrew if you haven't already:</Typography>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <pre>
                    <code className="language-bash">
                      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
                    </code>
                  </pre>
                </Box>
                
                <Typography paragraph>2. Install Node.js and npm using Homebrew:</Typography>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <pre>
                    <code className="language-bash">
                      brew install node
                    </code>
                  </pre>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                  Option 2: Direct Download
                </Typography>
                <Typography paragraph>
                  Download and install Node.js from the <Link href="https://nodejs.org/en/download/" target="_blank">official website</Link>.
                </Typography>
              </Box>
            )}
            
            {tabValue === 2 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Option 1: Using Package Manager (Ubuntu/Debian)
                </Typography>
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <pre>
                    <code className="language-bash">
                      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                      sudo apt-get install -y nodejs
                    </code>
                  </pre>
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }}>
                  Option 2: For other Linux distributions
                </Typography>
                <Typography paragraph>
                  Please check the <Link href="https://nodejs.org/en/download/package-manager/" target="_blank">Node.js installation guide</Link> for your specific distribution.
                </Typography>
              </Box>
            )}
            
            <Alert severity="success" sx={{ mt: 2 }}>
              To verify your installation, run the following commands:
              <Box sx={{ position: 'relative', mt: 1 }}>
                <pre>
                  <code className="language-bash">
                    node --version
                    npm --version
                  </code>
                </pre>
              </Box>
            </Alert>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Installation" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Typography paragraph>
              Once Node.js and npm are installed, install COBIT CLI globally:
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <pre>
                <code className="language-bash">
                  npm install @manoj2002/cobit -g
                </code>
              </pre>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Commands Reference" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Command</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
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
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Usage Examples" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Initialize a new repository
            </Typography>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <pre>
                <code className="language-bash">
                  cobit init
                </code>
              </pre>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Stage files
            </Typography>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <pre>
                <code className="language-bash">
                  cobit add index.js
                </code>
              </pre>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Create a commit
            </Typography>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <pre>
                <code className="language-bash">
                  cobit commit "Add initial files"
                </code>
              </pre>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Push a code
            </Typography>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <pre>
                <code className="language-bash">
                  cobit push
                </code>
              </pre>
            </Box>
            
            <Typography variant="subtitle1" fontWeight="bold">
              Clone an existing repository
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <pre>
                <code className="language-bash">
                  cobit clone abc123
                </code>
              </pre>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader 
            title="Web & CLI Integration" 
            sx={{ backgroundColor: 'primary.main', color: 'white' }}
          />
          <CardContent>
            <Typography paragraph>
              COBIT CLI and web interface work together seamlessly:
            </Typography>
            <ul>
              <li>Code snippets created via CLI can be viewed and edited in the web interface</li>
              <li>Use the CLI to manage code directly from your development environment</li>
              <li>Share snippet IDs with team members for easy collaboration</li>
              <li>Access your snippets from anywhere with the web interface</li>
            </ul>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<LinkedInIcon />}
              component={Link}
              href="https://www.linkedin.com/in/manojgowdabr89"
              target="_blank"
              sx={{ mt: 2 }}
            >
              View on Developer Profile
            </Button>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default CLIInfo;