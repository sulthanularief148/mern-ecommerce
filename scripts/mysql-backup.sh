#!/bin/sh
set -eu

# Runs forever inside a small sidecar container: dump the DB on an interval,
# gzip it, and prune anything older than the retention window. No manual
# "remember to back up" step — this is the whole point of running it as its
# own always-on service instead of a cron job someone has to remember to set up.

RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
INTERVAL_SECONDS="${BACKUP_INTERVAL_SECONDS:-86400}"
BACKUP_DIR="/backups"

mkdir -p "$BACKUP_DIR"

while true; do
    timestamp=$(date +%Y%m%d_%H%M%S)
    dest="$BACKUP_DIR/${MYSQL_DATABASE}_${timestamp}.sql.gz"
    echo "[mysql-backup] Dumping $MYSQL_DATABASE -> $dest"

    if mysqldump -h mysql -u root --single-transaction --quick --routines --triggers "$MYSQL_DATABASE" | gzip > "$dest.tmp"; then
        mv "$dest.tmp" "$dest"
        echo "[mysql-backup] Wrote $(du -h "$dest" | cut -f1)"
    else
        echo "[mysql-backup] mysqldump failed, discarding partial file" >&2
        rm -f "$dest.tmp"
    fi

    find "$BACKUP_DIR" -name "${MYSQL_DATABASE}_*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete
    echo "[mysql-backup] Sleeping ${INTERVAL_SECONDS}s"
    sleep "$INTERVAL_SECONDS"
done
