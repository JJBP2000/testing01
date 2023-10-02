<?php

namespace App\Models\Course;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseFile extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "course_clase_id",
        "name_file",
        "size",
        "time",
        "resolution",
        "file",
        "type"
    ];

    public function setCreatedAttribute($value) 
    {
        date_default_timezone_set("America/Guatemala");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAttribute($value) 
    {
        date_default_timezone_set("America/Guatemala");
        $this->attributes["updated_at"] = Carbon::now();
    }
}
