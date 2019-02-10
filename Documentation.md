# challenge3
```
Architecture/Design Document
```
### Table of Contents

1. Technology Stack
2. Features and functions
3. Structure

## Technology Stack
Nodejs 
Express.js ( Server )
MongoDB  ( database )
Semantic-ui ( frontend framework )

## Features and functions
### Register
Register page takes following information
1. Username - should be unique
2. Email ID
3. Password
4. Avatar image
It stores the hashed password in the database. 
For seturity we have used passport-local for handle authentication and cookie management.

### Login
You will be redirected to this page if you want to post/comment/like or make friend.

### Post
You can add a post. Edit it. Delete it. Also option won't be visible to others only owner can see the options.

### Vote
You can vote as many times as you want to posts which does not belong to you.
### Comment 
You can add a comment to existing post. Edit it. Delete it. Only the owner of the comment can edit/ delete existing comment. Also option won't be visible to others only owner can see the options.

### Add friend 
You can add a friend you like by going to their profile page. You will see "Add friend " option.

### Common chat room
You can choose your alias name. Your chats will be stored in your browser cache. You can clear it yourself or it will be cleared when we restart the server.

### User page 
Has all the details of the user
1. Recent posts
2. Total friends
3. Total likes
4. Total Posts
5. Option to add friend
6. About user
7. When he joined
Only owner can edit this informations.

## Structure
