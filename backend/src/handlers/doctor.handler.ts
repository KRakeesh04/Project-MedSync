import pool from "../db/db.ts";
import type {Request,Response} from 'express';

export const getAllDoctors = async (req:Request, res:Response) =>{
    try{
        const query = `
        SELECT doctor_id,name,fee_per_patient,basic_monthly_salary,gender
        FROM medsync.doctor
        ORDER BY doctor_id ASC;
        `;
        const [rows] = await pool.execute(query);
        res.status(200).json({
            success:true,
            message: 'Doctors fetched successfully',
            data:rows
        });
    }
    catch (error){
        console.error('Database error:',error);
        res.status(500).json({
            success:false,
            message:'Falied to fetch doctors',
            data:[]
        });
    }
};

export const getDoctorByID = async (req:Request,res:Response) =>{
    try{
        const {id} = req.params;
        if (!id || isNaN(Number(id))){
            return res.status(400).json({
                success:false,
                message:"Please provide a valid doctor ID",
                data:null
            });
        }

        const query = `
        SELECT doctor_id,name,fee_per_patient,basic_monthly_salary,gender
        FROM doctor
        WHERE doctor_id = ?;
        `;
        const [rows] = await pool.execute(query, [id]);
        const doctorRows = rows as any[];

        if (doctorRows.length === 0){
            return res.status(404).json({
                success: false,
                message : 'Doctor not found',
                data:null
            });
        }
        res.status(200).json({
            success:true,
            message : 'Doctor found',
            data: doctorRows
        });
    }
    catch (error){
        console.error('Database error:',error);
        res.status(500).json({
            success :false,
            message: 'Failed to fetch doctor',
            data: null
        });
    }
};


export const addDoctor = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();

    const { name, fee_per_patient, basic_monthly_salary, gender, branch_id, specialties } = req.body;

    // Validate required fields
    if (!name || !fee_per_patient || !basic_monthly_salary || !gender) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Name, fee per patient, basic monthly salary, and gender are required'
      });
    }

    console.log('Adding doctor with data:', { name, fee_per_patient, basic_monthly_salary, gender, branch_id });

    // 1. Insert into user table first with temporary username
    const [userResult] = await connection.execute(
      'INSERT INTO user (username, password_hash, role, branch_id, is_approved, created_at, is_deleted) VALUES (?, ?, ?, ?, ?, NOW(), false)',
      [
        'temp_doctor', // Temporary username
        'temp_hash_' + Date.now(), // Temporary password hash
        'Doctor',
        branch_id,
        true
      ]
    );

    // 2. Get the auto-generated user_id
    const userId = (userResult as any).insertId;

    // 3. Update username to be "doctor" + user_id
    await connection.execute(
      'UPDATE user SET username = ? WHERE user_id = ?',
      [`doctor${userId}`, userId]
    );

    console.log(`Created user with ID: ${userId} and username: doctor${userId}`);

    // 4. Insert into doctor table using the same user_id
    await connection.execute(
      'INSERT INTO doctor (doctor_id, name, fee_per_patient, basic_monthly_salary, gender) VALUES (?, ?, ?, ?, ?)',
      [userId, name, fee_per_patient, basic_monthly_salary, gender]
    );

    console.log('Created doctor record');

    // 4. Insert doctor specialties
    if (specialties && specialties.length > 0) {
      for (const specialtyId of specialties) {
        await connection.execute(
          'INSERT INTO doctor_speciality (doctor_id, speciality_id, added_at) VALUES (?, ?, NOW())',
          [userId, specialtyId]
        );
      }
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: {
        doctor_id: userId,
        username: `doctor${userId}`,
        name,
        fee_per_patient,
        basic_monthly_salary,
        gender,
        branch_id,
        specialties: specialties || []
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Error adding doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add doctor',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    connection.release();
  }
};