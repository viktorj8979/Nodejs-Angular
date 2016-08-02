#KeePass reader - AngularJS + Bootstrap + Angular-Treeview + ZeroClipboard + Node.js

[Node.js](http://nodejs.org/) with [AngularJS](http://angularjs.org/) implementation of a [KeePass2](http://www.keepass.info/) editor.

## Installation
First, you need Node.js running on your server of choice and navigate to a suitable folder. Then:
````
~$ git clone https://github.com/viktorj8979/Nodejs-Angular/keepass-node.git
~$ cd Angular-node-bootstrap
````
You'll find a config template `keepass-node-config.template.js` which shows you how to configure port (default 8443),
an optional context path (also known as base path), https (optional), basic authentication (optional),
 and Google Drive sync (optional).
Optional features are disabled by default.

To give KeePass-Node a minimal config you need to create a file `keepass-node-config.js` in the project's root
folder and paste at least something like this:
````
module.exports = {
  "port": 8443
};
````

After changing its content to fit your needs, you can finish the installation and start the KeePass-Node server:
````
~/Angular-node-bootstrap$ npm install
~/Angular-node-bootstrap$ npm start
````
NPM should download a small part of the internet for you and start the KeePass-Node server on the configured port.
You may now enter the URL into your browser like follows,
just replace "localhost" with your hostname: [http://localhost:8443/](http://localhost:8443/).

KeePass-Node comes with an `example.kdbx` which should be the already selected database. You have
to enter the keepass file password now, the default is `password`. After a click on `load`, you should
see the familiar tree structure of keepass groups.

## How to provide your personal KeePass2 file

### Local copy
Then you need to provide your keepass file. KeePass-Node expects any keepass files in the subfolder `./local/`.
You should find the mentioned `example.kdbx` there. You can copy your keepass file to that folder
or create a symbolic link (Windows users may ignore that hint). Hit `CTRL-C` if KeePass-Node is still running
or use another shell.
````
~/Angular-node-bootstrap$ cd local
~/Angular-node-bootstrap/local$ ln -s ~/path/to/my/keepass.kdbx keepass.kdbx
````
Now start the server again (if not still running):
````
~/Angular-node-bootstrap/local$ cd ..
~/Angular-node-bootstrap$ npm start
````
Refresh your browser window and you should see your keepass.kdbx in the database dropdown list.

### Download from Google Drive

In case you also keep your keepass.kdbx file on Google Drive, you can make KeePass-Node update the local copy by
downloading it from Google Drive. I didn't want to publicly share my keepass file, so I configured a web application
client for Google Drive at the [Google Developers Console](https://console.developers.google.com/). If this is
completely new for you, you can find a very short introduction at the
Google Drive SDK [Quickstart](https://developers.google.com/drive/web/quickstart/quickstart-nodejs). Essentially, you'll
need to go through the [setup of a project and application](https://console.developers.google.com/flows/enableapi?apiid=drive)
in the Developers Console.

After your application setup, KeePass-Node need the following properties:
````
"client_id": "123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
"client_secret": "aBcDeFgHiJkL987456_01234",
"redirect_uris": ["https://www.example.com:8843/update/oauth2callback"]
````
Please make sure that the first element in `redirect_uris` has a path equalling `/update/oauth2callback`, due to the current implementation.
The properties need to be pasted into the config file `keepass-node-config.js` under `googleDrive.clientSecret`.
Please also provide a `googleDrive.fileTitle` and change the property `googleDrive.enabled` to `true`.

After restarting KeePass-Node, you can enter the following uri in your browser: `https://www.example.com:8843/update`.
It should redirect you to a Google page asking you for permission to make KeePass-Node use your Google Drive in readonly mode.
When you accept the permission, you'll be redirected back to KeePass-Node, and it will download the file named like you have configured as
`fileTitle` and save it at `.../local/google-drive.kdbx`.

A browser refresh later, and you can choose the updated `google-drive.kdbx` from the KeePass-Node database dropdown.


