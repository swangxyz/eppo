@extends('layouts.panel')
@section('title','PPO Items')
@section('panelHeading','Add a New PPO Item')
@section('panelBody')
{!! Form::model($item, [
    'route'=>'ppoitems.store',
    'role'=>'form',
    'class'=>'col-md-12 form-inline'])
    !!}
    @include('ppo_items/partials/_form_body')
{!! Form::close() !!}
@endsection
