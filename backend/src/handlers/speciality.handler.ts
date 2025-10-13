import pool from "../db/db.ts";
import type { Request, Response } from 'express';

export const getAllSpecialties = async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT speciality_id, speciality_name, description
            FROM speciality
            ORDER BY speciality_id ASC;
        `;
        const [rows] = await pool.execute(query);
        
        res.status(200).json({
            success: true,
            message: 'Specialties fetched successfully',
            data: rows
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch specialties',
            data: []
        });
    }
};

export const addSpecialty = async (req: Request, res: Response) => {
    try {
        console.log('Received request body:', req.body);
        const { speciality_name, description } = req.body;

        // Validate required fields
        if (!speciality_name || !description) {
            console.log('Validation failed - missing fields');
            return res.status(400).json({
                success: false,
                message: 'Specialty name and description are required'
            });
        }

        console.log('Inserting specialty:', { speciality_name, description });

        // Get next available speciality_id
        const [maxResult] = await pool.execute(
            'SELECT COALESCE(MAX(speciality_id), 0) + 1 as next_id FROM speciality'
        );
        const nextId = (maxResult as any)[0].next_id;

        // Insert new specialty with explicit ID
        const query = `
            INSERT INTO speciality (speciality_id, speciality_name, description)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [nextId, speciality_name, description]);
        
        console.log('Insert result:', result);

        res.status(201).json({
            success: true,
            message: 'Specialty added successfully',
            data: {
                speciality_id: nextId,
                speciality_name,
                description
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add specialty',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

