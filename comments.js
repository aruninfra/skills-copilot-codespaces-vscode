const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// create a web server that listens on port 3000
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    
    if (pathname === '/') {
        if (req.method === 'GET') {
            // read comments from comments.txt file
            fs.readFile('comments.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    // display comments in the browser
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 200;
                    res.end(`
                        <html>
                            <body>
                                <form method="POST" action="/">
                                    <textarea name="comment" placeholder="Type your comment here"></textarea>
                                    <br>
                                    <button type="submit">Submit</button>
                                </form>
                                <br>
                                <h2>Comments:</h2>
                                <pre>${data}</pre>
                            </body>
                        </html>
                    `);
                }
            });
        } else if (req.method === 'POST') {
            let body = '';
            
            req.on('data', (chunk) => {
                body += chunk;
            });
            
            req.on('end', () => {
                // parse the comment from the request body
                const { comment } = querystring.parse(body);
                
                // save the comment to comments.txt file
                fs.appendFile('comments.txt', `${comment}\n`, 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    } else {
                        // redirect the user back to the root route
                        res.statusCode = 302;
                        res.setHeader('Location', '/');
                        res.end();
                    }
                });
            });
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
// comments should be separated by a line break
