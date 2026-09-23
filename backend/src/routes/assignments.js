const express=require('express');
const router=express.Router();
const supabase=require('../supabase');
const {authenticateToken}=require('../middleware/auth');
router.use(authenticateToken);
router.get('/',async(req,res)=>{const {data,error}=await supabase.from('assignments').select('*').eq('user_id',req.userId).order('created_at',{ascending:false});if(error)return res.status(500).json({success:false,error:error.message});res.json({success:true,assignments:data||[]});});
router.post('/:id/submit',async(req,res)=>{const {data,error}=await supabase.from('assignments').update({status:'submitted',submission_date:new Date().toISOString()}).eq('id',req.params.id).eq('user_id',req.userId).select().single();if(error)return res.status(404).json({success:false,error:'Assignment not found'});res.json({success:true,assignment:data});});
router.post('/',async(req,res)=>{if(!req.body.title)return res.status(400).json({success:false,error:'Title is required'});const row={...req.body,user_id:req.userId,id:req.body.id||crypto.randomUUID(),status:req.body.status||'pending'};delete row.userId;const {data,error}=await supabase.from('assignments').insert(row).select().single();if(error)return res.status(400).json({success:false,error:error.message});res.status(201).json({success:true,assignment:data});});
module.exports=router;
