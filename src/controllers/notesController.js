import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export async function getAllNotes(request, response) {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
    sortBy = '_id',
    sortOrder = 'ascending',
  } = request.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  response.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
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
