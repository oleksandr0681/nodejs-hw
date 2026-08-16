import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export async function getAllNotes(request, response) {
  const notes = await Note.find();
  response.status(200).json(notes);
}

export async function getNoteById(request, response) {
  const noteId = request.params.noteId;
  const note = await Note.findById(noteId);

  if (note === null) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
}

export async function createNote(request, response) {
  const note = await Note.create(request.body);
  response.status(201).json(note);
}

export async function deleteNote(request, response) {
  const { noteId } = request.params;
  const note = await Note.findOneAndDelete({ _id: noteId });

  if (note === null) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
}

export async function updateNote(request, response) {
  const { noteId } = request.params;
  const note = await Note.findOneAndUpdate({ _id: noteId }, request.body, {
    returnDocument: 'after',
  });

  if (note === null) {
    throw createHttpError(404, 'Note not found');
  }

  response.status(200).json(note);
}
