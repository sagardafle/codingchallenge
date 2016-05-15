This projects works smoothly in Firefox without any configurations.
However, to run on Google Chrome;we will need to do the following.
The Problem
The Google Chrome browser will not load local file by default due to security reason. The discussion has gone back and forth for the last 7 years and finally there is a reasonable workable solution.

The Solution
Steps to run in Chrome.
1. Go to Chrome.exe location.
2. Open cmd from that folder. 
3. Run chrome.exe --user-data-dir="C:/Chrome dev session2" --disable-web-security
4. Chrome opens in different window.
5.open index.html and perform tests.

References:
1. http://www.chrome-allow-file-access-from-file.com/windows.html
2. http://stackoverflow.com/questions/32453806/uncaught-securityerror-failed-to-execute-replacestate-on-history-cannot-be
