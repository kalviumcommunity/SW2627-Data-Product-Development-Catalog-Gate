-- remove columns valid_count and invalid_count from dataset profiles

ALTER TABLE dataset_profiles DROP COLUMN valid_count;
ALTER TABLE dataset_profiles DROP COLUMN invalid_count;