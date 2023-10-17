<?php

namespace App\Models\Course;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Course\Categorie;
use Illuminate\Support\Facades\Log;
use App\Models\Course\CourseSection;
use App\Models\Discount\DiscountCourse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "title",
        "subtitle",
        "slug",
        "imagen",
        "precio_usd",
        "precio_gt",
        "categorie_id",
        "sub_categorie_id",
        "user_id",
        "level",
        "idioma",
        "vimeo_id",
        "time",
        "description",
        "requirements",
        "who_is_it_for",
        "state",
    ];

    public function setCreatedAtAttribute($value)
    {
        date_default_timezone_set("America/Guatemala");
        $this->attributes["created_at"] = Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
        date_default_timezone_set("America/Guatemala");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function instructor()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function sub_categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function sections()
    {
        return $this->hasMany(CourseSection::class);
    }

    public function discount_courses()
    {
        return $this->hasMany(DiscountCourse::class);
    }

    public function getDiscountCAttribute()
    {
        date_default_timezone_set("America/Guatemala");
        $discount = null;
        foreach ($this->discount_courses as $key => $discount_course) {
            // Agregar logging para ayudar a depurar
            Log::info('Discount Course: ', ['discount_course' => $discount_course]);
    
            // Comprobar si $discount_course y las propiedades anidadas existen y no son nulas
            if (
                $discount_course && 
                $discount_course->discount
            ) {
                if (Carbon::now()->between($discount_course->discount->start_date, Carbon::parse($discount_course->discount->end_date)->addDays(1))) {
                    // EXISTE UNA CAMPAÑA DE DESCUENTO CON EL CURSO
                    $discount = $discount_course->discount;
                    break;
                }
            }
        }
        return $discount;
    }
    

    public function getDiscountCTAttribute()
    {
        date_default_timezone_set("America/Guatemala");
        $discount = null;
        foreach ($this->categorie->discount_categories as $key => $discount_categorie) {
            // Verificar si las propiedades del objeto están seteadas y no son null antes de intentar acceder a ellas
            if($discount_categorie && 
               $discount_categorie->discount && 
               property_exists($discount_categorie->discount, 'type_campaing') && 
               property_exists($discount_categorie->discount, 'state') && 
               $discount_categorie->discount->type_campaing == 1 && 
               $discount_categorie->discount->state == 1) 
            {
                if(Carbon::now()->between($discount_categorie->discount->start_date,Carbon::parse($discount_categorie->discount->end_date)->addDays(1))){
                    // EXISTE UNA CAMPAÑA DE DESCUENTO CON EL CURSO
                    $discount = $discount_categorie->discount;
                    break;
                }
            }
        }
        return $discount;
    }
    

    public function getFilesCountAttribute()
    {
        $files_count = 0;

        foreach ($this->sections as $keyS => $section) {
            foreach ($section->clases as $keyC => $clase) {
                $files_count += $clase->files->count();
            }
        }

        return $files_count;
    }

    function AddTimes($horas)
    {
        $total = 0;
        foreach($horas as $h) {
            $parts = explode(":", $h);
            
            // Verificar que $parts tiene al menos 3 elementos
            if(count($parts) >= 3) {
                $total += $parts[2] + $parts[1]*60 + $parts[0]*3600;
            } else {
                // Manejar el caso en que $parts no tiene 3 elementos
                // Por ejemplo, puedes loguear un mensaje de error o lanzar una excepción
                Log::error('Hora en formato incorrecto: ' . $h);
            }
        }
        
        $hours = floor($total / 3600);
        $minutes = floor(($total / 60) % 60);
        $seconds = $total % 60;
    
        return $hours." hrs ".$minutes." mins";
    }
    

    public function getCountClassAttribute()
    {
        $num = 0;

        foreach ($this->sections as $key => $section) {
            $num += $section->clases->count();
        }

        return $num;
    }

    public function getTimeCourseAttribute()
    {
       $times = [];
       foreach ($this->sections as $keyS => $section) {
        foreach ($section->clases as $keyC => $clase) {
            array_push($times,$clase->time);
        }
       }
       return $this->AddTimes($times);
    }

    function scopeFilterAdvance($query,$search,$state)
    {
        if($search){
            $query->where("title","like","%".$search."%");
        }
        if($state){
            $query->where("state",$state);
        }
        
        return $query;
    }
}
