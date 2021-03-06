<?php

namespace eppo;

use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    protected $fillable = [
        'name','instruction','is_rev_aid','is_eap',
    ];
    public function ppoItems()
	{
    	return $this->hasMany('eppo\PpoItem');
	}
    public function lucodes()
    {
        return $this->hasMany('eppo\Lucode')->select(['id','description','code']);
    }
}
