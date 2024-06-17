# Radio Room Web Application
This web application allows users to create and join virtual rooms where they can listen to radio stations together. It uses the Radio Browser API to fetch and play currently active stations based on the host's preferences.

## Features
- **Create Room**: Hosts can create a room and set preferences for radio stations (language and tags).
- **Join Room**: Users can join a room using a unique room code.
- **Control Permissions**: Hosts can permit or restrict guests from pausing the radio.
- **Dynamic Station Selection**: Hosts can change radio stations, and guests can too if permitted by the host.
- **Persistent Preferences**: The selected language and tags for radio stations can be updated by the host even after the room is formed.
- **Unique Room Code**: Each room has a unique code that users need to join.
- **Single Room Participation**: A user can only be part of one room at a time.

## Technologies Used
1. Frontend: React                   
2. Backend: Django           
3. API: [Radio Browser API](https://github.com/ivandotv/radio-browser-api/tree/master?tab=readme-ov-file)


## Prerequisites
- Node.js
- npm
- Python
- Django
- Backend Setup
  
## Installation

### Clone the repository:

``` bash
git clone https://github.com/yourusername/Radio_Player.git
cd Radio_Player
```

### Backend Setup
#### Install dependencies:
```bash
pip install -r requirements.txt
```

#### Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:
python manage.py runserver


### Frontend Setup
Note: The node_modules directory is included in the repository for convenience. However, it is recommended to follow the standard practice of using npm install to install dependencies.

#### Navigate to the frontend directory:
```bash
cd frontend
```
#### Install dependencies:

```bash
npm install
```
#### Creation of Babel and webpack configuration files:
Ensure babel.config.json and webpack.config.js are present in the frontend directory. These files are essential for configuring Babel and Webpack and should be included in the repository.
Create a file with name babel.config.json and paste the code
```js
// Babel configuration file: 
{
    "presets": [
      [
        "@babel/preset-env",
        {
          "targets": {
            "node": "10"
          }
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": ["@babel/plugin-transform-class-properties"]
  }
```
Create a file with name webpack.config.js and paste the code
```js
// Webpack configuration file: 
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      })
  ]
};
```

### Run the server
#### Start the React development server:
```bash
npm run dev
```

#### Start the Django development server:
```bash
cd ..
python manage.py runserver
```

## Usage
#### Creating a Room:
1. Navigate to the home page.
2. Click on "Create Room".
3. Set the desired language and tags for the radio stations.
4. Set if the guest can pause the radio or not.
5. Share the unique room code with others to let them join.

#### Joining a Room:

1. Enter the unique room code on the join page.

#### In the Room:

1. The radio will play the station selected by the host.
2. The host (or guests, if permitted) can pause the radio station.
3. Anyone can change the radio station.
4. Users can leave the room anytime.


## Contributing
1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature-name.
3. Make your changes and commit them: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/your-feature-name.
5. Submit a pull request.
   
## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any inquiries or issues, please contact [techjk021@gmail.com](techjk021@gmail.com).
