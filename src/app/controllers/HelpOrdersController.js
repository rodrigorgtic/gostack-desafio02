import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    const help_orders = await HelpOrders.findAll({
      where: {
        student_id: req.params.id,
      },
      // Fazendo o relacionamento.
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verificando se o student existe.
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student not exist' });
    }

    const help_order = await HelpOrders.create({
      student_id: req.params.id,
      question: req.body.question,
    });

    return res.json(help_order);
  }

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verificando se a Help Order existe.
    const help_order = await HelpOrders.findByPk(req.params.id);

    if (!help_order) {
      return res.status(401).json({ error: 'Help order not exist.' });
    }

    const {
      id,
      question,
      answer,
      answer_at,
      created_at,
    } = await help_order.update({
      answer: req.body.answer,
      answer_at: Date.now(),
    });

    return res.json({ id, question, answer, answer_at, created_at });
  }
}

export default new HelpOrdersController();
