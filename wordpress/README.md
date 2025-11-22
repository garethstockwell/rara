Steps to create a local clone of rar.org.uk:

1. Create a directory where the website files will be stored.
```
mkdir /some/directory
```

2. Set the value of RARA_WEBSITE in .env to the path of this directory.
```
rm -f .env
echo RARA_WEBSITE=/some/directory > .env
```

3. Set up shell environment.
```
source envsetup.sh
```

4. Download Updraft backup files (*.zip and *db.gz) from rar.org.uk and store locally.
```
mkdir -p ${RARA_WEBSITE}/wp-content/updraft
cp <files> ${RARA_WEBSITE}/wp-content/updraft
```

5. Start the containers
```
docker compose -f ${RARA_WORDPRESS}/compose.yaml up
```

6. Open Wordpress via localhost:8000

7. Create a user.
The login details don't matter since this will be overwritten, so username "test" and password "test" are fine.

8. Log in
- Activate the "RARA" theme.
- Install "UpdraftPlus: WP Backup & Migration Plugin".

9. Go to the Updraft settings page. Under "Existing backups" you should see one entry, with the following components:
- Database
- Plugins
- Themes
- Uploads
- Others
Restore this backup, ticking all components.

10. Log in to localhost:8000 using credentials from rar.org.uk
