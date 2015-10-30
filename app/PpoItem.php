<?php

namespace eppo;

use Illuminate\Database\Eloquent\Model;

class PpoItem extends Model
{
    protected $fillable = [
    'name',
    'is_active',
    'ppo_id',
    'ppo_section_id',
    'medication_id',
    'dose_base',
    'dose_calculation_type_id',
    'fixed_dose_result',
    'dose_unit_id',
    'dose_route_id',
    'instruction',
    'is_instruction_input',
    'is_start_date',
    'is_frequency_input',
    'is_duration_input',
    'is_mitte_input',
    'is_repeat_input',
    'mitte_unit_id',
    ];
	public function Ppo()
	{
    	return $this->belongsTo('eppo\Ppo');
	}
    public function ppoSection()
    {
        return $this->belongsTo('eppo\PpoSection');
    }
    public function medication()
    {
        return $this->belongsTo('eppo\Medication');
    }
    public function doseCalculationType()
    {
        return $this->belongsTo('eppo\DoseCalculationType');
    }
    public function doseRoute()
    {
        return $this->belongsTo('eppo\DoseRoute');
    }
    public function doseUnit()
    {
        return $this->belongsTo('eppo\DoseUnit');
    }
    public function mitteUnit()
    {
        return $this->belongsTo('eppo\MitteUnit');
    }
}