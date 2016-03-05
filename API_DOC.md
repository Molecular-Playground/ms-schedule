# MS_SCHEDULE

Each section in this document contains all valid HTTP verbs that can
be called.  Section headers are the route.

# /public/

### #GET
Gets a schedule with all associated playlists.

        
Returns: 

        {
            "schedule": [
                {"pid":1,"startTime":"2:00pm"},
                {"pid":2,"startTime":"4:00pm"},
                {"pid":3,"startTime":"6:00pm"},
                {"pid":1,"startTime":"6:00pm"}
                ],
            "playlists": [
                {
                    "pid":1,
                    "playlist":[1,2,3]
                },
                {
                    "pid":2,
                    "playlist":[4,1,5]
                },
                {
                    "pid":3,
                    "playlist":[3,2,2]
                }
            ]
        }

This is an unauthenticated endpoint.

# /auth/schedule

### #GET
Gets a full schedule for logged in user.

Params:
-Header
        {
            "token": jwt
        }
        
Returns:
        {
            "schedule": [
                {"pid":1,"startTime":"2:00pm"},
                {"pid":2,"startTime":"4:00pm"},
                {"pid":3,"startTime":"6:00pm"},
                {"pid":1,"startTime":"6:00pm"}
            ]
        }

This is an authenticated endpoint.

# /auth/schedule

### #POST
Edits a users schedule.

Params:
-Header
        {
            "token": jwt
        }
-Body

        {
            "schedule": [
                {"pid":1,"startTime":"2:00pm"},
                {"pid":2,"startTime":"4:00pm"},
                {"pid":3,"startTime":"6:00pm"},
                {"pid":1,"startTime":"6:00pm"}
            ] 
        }
        
Returns:
        {
            success: true,
            message: 'Updated schedule for user ' + userid
        }

This is an authenticated endpoint.

# /auth/playlist

### #GET
Gets all of the users playlists.

Params:
-Header
        {
            "token": jwt
        }
        
Returns:
        {
            "playlists": [
                {
                    "pid":1,
                    "name":"awesome playlist 1",
                    "playlist":[1,2,3]
                },
                {
                    "pid":2,
                    "name":"awesome playlist 2",
                    "playlist":[4,1,5]
                },
                {
                    "pid":3,
                    "name":"awesome playlist 3",
                    "playlist":[3,2,2]
                }
            ]
        }

This is an authenticated endpoint.

# /auth/playlist

### #POST
Edits a playlist.

Params:
-Header
        {
            "token": jwt
        }
-Body
        {
            "data": {
                pid: playlistID,
                playlist: [5,1,3,4,7,3]
            }
        }
        
Returns:
        {
            success: true,
            message: 'Updated playlist ' + data.pid
        }

This is an authenticated endpoint.

# /auth/playlist/rename

### #POST
Renames a playlist.

Params:
-Header
        {
            "token": jwt
        }
-Body
        {
            "data": {
                pid: playlistID,
                name: "The best playlist"
            }
        }
        
Returns:
        {
            success: true,
            message: 'Playlist ' + data.pid + ' renamed to ' + data.name
        }

This is an authenticated endpoint.

# /auth/playlist

### #PUT
Adds a new playlist.

Params:
-Header
        {
            "token": jwt
        }
-Body
        {
            "data": {
                name: "The best playlist",
                playlist: [5,1,3,4,7,3]
            }
        }
        
Returns:
        {
            success: true,
            message: "Added playlist",
            pid: playlistID
        }

This is an authenticated endpoint.