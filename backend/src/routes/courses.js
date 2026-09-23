const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');
router.use(authenticateToken);

router.get('/', async (req,res)=>{ const {data,error}=await supabase.from('courses').select('*').eq('user_id',req.userId).order('created_at',{ascending:false}); if(error)return res.status(500).json({success:false,error:error.message}); res.json({success:true,courses:data||[]}); });
router.get('/:id', async (req,res)=>{ const {data,error}=await supabase.from('courses').select('*').eq('id',req.params.id).eq('user_id',req.userId).maybeSingle(); if(error)return res.status(500).json({success:false,error:error.message}); if(!data)return res.status(404).json({success:false,error:'Course not found'}); res.json({success:true,course:data}); });
router.put('/:id/progress', async (req,res)=>{ const progress=Math.min(100,Math.max(0,Number(req.body.progress))); const {data:current,error:readError}=await supabase.from('courses').select('total_lessons').eq('id',req.params.id).eq('user_id',req.userId).single(); if(readError)return res.status(404).json({success:false,error:'Course not found'}); const total=current.total_lessons||20; const completed=req.body.completed_lessons!==undefined?Number(req.body.completed_lessons):Math.min(total,Math.round(progress*total/100)); const {data,error}=await supabase.from('courses').update({progress,completed_lessons:completed}).eq('id',req.params.id).eq('user_id',req.userId).select().single(); if(error)return res.status(500).json({success:false,error:error.message}); res.json({success:true,course:data}); });
module.exports=router;
