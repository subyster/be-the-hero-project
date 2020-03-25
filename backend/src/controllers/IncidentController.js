const connection = require('../database/connection');

module.exports = {
    async index(request, response){
        const { page = 1 } = request.query; //criação do esqema de paginação

        const [count] = await connection('incidents').count();  //conta o total de registos para enviar ao front-end


        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id') //comando join relaciona dados de duas tabelas, no caso, ongs e incidents
            .limit(5)   //limita a 5 registros por página
            .offset((page - 1) * 5) //começa do 0 para criar a página 1
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);   
            //este último seleciona quais dados agrupados no join() serão mostrados (todos (*) de incidents e alguns da ong)

        response.header('X-Total-Count', count['count(*)']); //envia o total de registros contados ao front-end

        return response.json(incidents);
    },
    
    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};