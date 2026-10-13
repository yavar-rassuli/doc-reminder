<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
   protected  $fillable =[
        'name', 
        'type', 
        'expires_at',
        'remind_days_before',
        'photo_path',
   ];

   public function user(){
    return $this->belongsTo(User::class);
}
}
