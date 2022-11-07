# Follow Mastodon User Browser Extension

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This extension adds a button to the toolbar that will popup a window to follow
the Mastodon user on the current page. This is mostly to scratch an itch where
some mastodon pages make you have to copy the username, then search for it in
your own instance, then click follow there once the search loads.

To use a server other than mastodon.social, go to the settings page and enter
the server address including https://, omitting any trailing slash.

## Problem

Clicking the follow button on a remote server presents a dialog where you can
copy the user name, paste it on your own instance, wait for the search to
complete and then click add.
![problem](https://user-images.githubusercontent.com/381361/200236814-4b62bdd1-1723-409a-a71e-4870e6a5bceb.png)

## Solution

A button on the toolbar (soon to be in the address bar)

![solution](https://user-images.githubusercontent.com/381361/200236821-37232f56-9903-4749-9af5-0370bef103a2.png)

That displays your instance's follow dialog directly.

![solution-popup](https://user-images.githubusercontent.com/381361/200236829-450f5ab6-4fa2-439d-8b36-20cbfd4c9640.png)


## License

Copyright ©️ 2022 Joshua McKinney

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
