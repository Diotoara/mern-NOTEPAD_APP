import express from "express";
import Note from "../models/notes.js";
import {protect} from "../middlewares/authMdl.js"

const router = express.Router();

//GET NOTES
router.get("/", protect ,async(req,res)=>{
    try {
        const notes = await Note.find({createdBy: req.user._id})
        // res.json("title: " + notes[0].title +", description: " + notes[0].description)
        res.json(notes)
    } catch (error) {
        console.log("Get all notes error: " + error);
        res.status(500).json({message:"server error"})
    }
})

//CREATE NOTE
router.post("/", protect, async(req,res)=>{
    const {title, description} = req.body;
    try {
        if(!title || !description){
            return res.status(400).json({message:"fill all the fields"})
        } 
        const note = await Note.create({
            title,
            description,
            createdBy:req.user._id,
        })
        res.status(201).json(note)
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
})

//GET A NOTE
router.get("/:id", protect, async(req,res)=>{
    try {
        const note = await Note.findById(req.params.id)
        // res.json(note)
        if(!note){
            return res.status(404).json({message:"Note not found"})
        }
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
})

//UPDATE A NOTE
router.put("/:id", protect, async(req,res)=>{
    const {title, description} = req.body;
    try {
       const note = await Note.findById(req.params.id)
        if(!note){
            return res.status(404).json({message:"Note not found"})
        } 
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(404).json({message:"not authorized"})
        }
        note.title = title || note.title
        note.description = description || note.description

        const updatedCode = await note.save();
        res.json(updatedCode)
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
})



//Delete a Note
router.delete("/:id", protect, async(req,res)=>{
    try {
        const note = await Note.findById(req.params.id)
        if(!note){
            return res.status(404).json({message:"Note not found"})
        } 
        if(note.createdBy.toString() !== req.user._id.toString()){
            return res.status(404).json({message:"not authorized"})
        }

        await Note.deleteOne();
        res.json({message:"Note deleted"})
    } catch (error) {
        res.status(500).json({message:"server error"})
    }
})

export default router