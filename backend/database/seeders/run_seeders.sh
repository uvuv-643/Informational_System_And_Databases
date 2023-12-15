./artisan make:seeder locations 50 district_id=districts full_address=word
./artisan make:seeder users 50 name=name password=word district_id=districts email=word
./artisan make:seeder orders 50 description=description location_id=locations user_id=users
./artisan make:seeder votings 50 order_id=orders voting_status_id=voting_statuses started_at=timestamp finished_at=null
./artisan make:seeder votes 10000 user_id=users voting_id=votings vote=bool created_at=timestamp
./artisan make:seeder jobs 50 order_id=orders job_status_id=job_statuses started_at=timestamp finished_at=null
