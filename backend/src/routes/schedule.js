const express=require('express');
const router=express.Router();
const supabase=require('../supabase');
const {authenticateToken}=require('../middleware/auth');
router.use(authenticateToken);
router.get('/',async(req,res)=>{const {data,error}=await supabase.from('schedule_events').select('*').eq('user_id',req.userId).order('created_at',{ascending:false});if(error)return res.status(500).json({success:false,error:error.message});res.json({success:true,events:(data||[]).map(e=>({...e,is_online:Boolean(e.is_online)}))});});
router.post('/',async(req,res)=>{if(!req.body.title||!req.body.day)return res.status(400).json({success:false,error:'Title and day are required'});const row={...req.body,user_id:req.userId,id:req.body.id||crypto.randomUUID(),is_online:Boolean(req.body.is_online)};delete row.userId;const {data,error}=await supabase.from('schedule_events').insert(row).select().single();if(error)return res.status(400).json({success:false,error:error.message});res.status(201).json({success:true,event:data});});
module.exports=router;
