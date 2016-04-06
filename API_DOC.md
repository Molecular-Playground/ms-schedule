# MS_SCHEDULE

Each section in this document contains all valid HTTP verbs that can
be called.  Section headers are the route.

# /:username

### #GET
Gets a schedule with all associated playlists and molecules.


Returns:

        {
            "schedule": [
                {"pid":1,"startTime":"2:00pm"},
                {"pid":2,"startTime":"4:00pm"},
                {"pid":3,"startTime":"6:00pm"},
                {"pid":1,"startTime":"6:00pm"}
                ],
            "playlists": {
                "1": [1, 3, 3, 2],
                "2": [2, 1, 3],
                "3": [3, 2, 1]
            },
            "molecules": {
                "1": "link 1",
                "2": "link 2",
                "3": "link 3"
            }
        }

This is an unauthenticated endpoint.

# /

### #GET
Gets a full schedule for logged in user.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
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

# /

### #POST
Edits a users schedule.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
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

# /playlist

### #GET
Gets all of the users playlists.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
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

# /playlist

### #POST
Edits a playlist.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
        }
-Body

        {
            "data": {
                "pid": playlistID,
                "playlist": "[5,1,3,4,7,3]"
            }
        }

Returns:

        {
            success: true,
            message: 'Updated playlist ' + data.pid
        }

This is an authenticated endpoint.

# /playlist/rename

### #POST
Renames a playlist.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
        }
-Body

        {
            "data": {
                "pid": playlistID,
                "name": "The best playlist"
            }
        }

Returns:

        {
            success: true,
            message: 'Playlist ' + data.pid + ' renamed to ' + data.name
        }

This is an authenticated endpoint.

# /playlist

### #PUT
Adds a new playlist.

Params:
-Header

        {
            "Authorization": "Token YOUR_TOKEN_HERE"
        }
-Body

        {
            "data": {
                "name": "playlist 3",
                "playlist": "[1,2,3]"
            }
        }

Returns:

        {
            success: true,
            message: "Added playlist",
            pid: playlistID
        }

This is an authenticated endpoint.
